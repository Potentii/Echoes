-- drop schema `echoes_schema`;
create schema if not exists `echoes_schema`;
use `echoes_schema`;


drop view if exists `user_contacts_view`;
drop view if exists `chat_users_view`;
drop view if exists `chat_messages_view`;
drop view if exists `user_chats_view`;


drop table if exists `message`;
drop table if exists `attachment`;
drop table if exists `group`;
drop table if exists `chat`;
drop table if exists `contact`;
drop table if exists `user`;



create table if not exists `user`(
	`id` BIGINT unsigned not null auto_increment unique,
    `name` TEXT not null,
    `login` VARCHAR(45) not null unique,
    `password` VARCHAR(16) not null,
    
    primary key(`id`)
);


create table if not exists `contact`(
	`id` BIGINT unsigned not null auto_increment unique,
    `me_user_fk` BIGINT unsigned not null,
    `contact_user_fk` BIGINT unsigned not null,
    
    foreign key(`me_user_fk`) references `user`(`id`),
    foreign key(`contact_user_fk`) references `user`(`id`),
    primary key(`id`)
);


create table if not exists `chat`(
	`id` BIGINT unsigned not null auto_increment unique,
    `name` TEXT not null,
    
    primary key(`id`)
);


create table if not exists `group`(
	`id` BIGINT unsigned not null auto_increment unique,
    `chat_fk` BIGINT unsigned not null,
    `user_fk` BIGINT unsigned not null,
    
    foreign key(`chat_fk`) references `chat`(`id`),
    foreign key(`user_fk`) references `user`(`id`),
    primary key(`id`)
);


create table if not exists `attachment`(
	`id` BIGINT unsigned not null auto_increment unique,
    `file_path` TEXT not null,
    `mime_type` VARCHAR(45) not null,
    
    primary key(`id`)
);


create table if not exists `message`(
	`id` BIGINT unsigned not null auto_increment unique,
    `text` TEXT not null,
    `date` DATETIME not null default now(),
    `origin_user_fk` BIGINT unsigned not null,
    `attachment_fk` BIGINT unsigned,
    `chat_fk` BIGINT unsigned not null,
    
    foreign key(`origin_user_fk`) references `user`(`id`),
    foreign key(`attachment_fk`) references `attachment`(`id`),
    foreign key(`chat_fk`) references `chat`(`id`),
    primary key(`id`)
);






create fulltext index `user_fulltext_index` on `user`(`name`);



-- Get chat's users
create view `chat_users_view` as
	select 
		`chat`.`id` as 'chat',
		`user`.`id`,
		`user`.`name`,
		`user`.`login`
		from `user`
		inner join `group`
			on `user`.`id` = `group`.`user_fk`
		inner join `chat`
			on `chat`.`id` = `group`.`chat_fk`;


-- Get chat's messages
create view `chat_messages_view` as
	select
		`chat`.`id` as 'chat',
        
		`message`.`id`,
		`message`.`text`,
        `message`.`date`,
		`message`.`origin_user_fk`,
        
        `user`.`name` as 'origin_user_name',
        
        `attachment`.`file_path` as 'attachment_file_path',
        `attachment`.`mime_type` as 'attachment_mime_type'
        
		from `message`
        left join `attachment`
			on `message`.`attachment_fk` = `attachment`.`id`
		inner join `chat`
			on `message`.`chat_fk` = `chat`.`id`
		inner join `user`
			on `message`.`origin_user_fk` = `user`.`id`;



-- Get user's contacts
create view `user_contacts_view` as
	select 
		me.`id` as 'user',
		other.`id`,
		other.`name`,
		other.`login`
		from `user` me
		inner join `contact` 
			on `contact`.`me_user_fk` = me.`id`
		inner join `user` other
			on `contact`.`contact_user_fk` = other.`id`;



-- Get user's chats
create view `user_chats_view` as
	select 
		`user`.`id` as 'user',
		`chat`.`id`,
		`chat`.`name`
		from `chat`
		inner join `group`
			on `chat`.`id` = `group`.`chat_fk`
		inner join `user`
			on `user`.`id` = `group`.`user_fk`;



drop function if exists user_is_on_chat;
delimiter $$
create function user_is_on_chat(arg_user_id BIGINT, arg_chat_id BIGINT) returns BOOL
begin
	return exists(select 1 from `chat_users_view` where `chat_users_view`.`id` = arg_user_id and `chat_users_view`.`chat` = arg_chat_id limit 1);
end $$
delimiter ;


drop procedure if exists try_login;
delimiter $$
create procedure try_login(in arg_user_login VARCHAR(45), in arg_user_password VARCHAR(16))
begin
	set autocommit = 0;
	start transaction;
		select `id`, `name` from `user` where `login` = arg_user_login and `password` = arg_user_password limit 1;
	commit;
end $$
delimiter ;


drop procedure if exists chat_add_user;
delimiter $$
create procedure chat_add_user(in arg_chat_id BIGINT, in arg_user_id BIGINT)
begin
	set autocommit = 0;
	start transaction;
		if not user_is_on_chat(arg_user_id, arg_chat_id) then
			-- If user wasn't on this chat before:
            insert into `group` (`chat_fk`, `user_fk`) values (arg_chat_id, arg_user_id);
		else
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User\'s already on this chat';
			rollback;
        end if;		
	commit;
end $$
delimiter ;


drop procedure if exists chat_create;
delimiter $$
create procedure chat_create(in arg_user_id BIGINT, in arg_chat_name TEXT)
begin
	declare var_chat_id BIGINT;
	set autocommit = 0;
	start transaction;
		insert into `chat` (`name`) values (arg_chat_name);
        set var_chat_id = LAST_INSERT_ID();
        call chat_add_user(var_chat_id, arg_user_id);
        
        -- Returning the created chat id:
        select `id`, `name` from `chat` where `id` = var_chat_id;
	commit;
end $$
delimiter ;


drop procedure if exists chat_get_feed;
delimiter $$
create procedure chat_get_feed(in arg_chat_id BIGINT)
begin
	set autocommit = 0;
	start transaction;
		select * from `chat_messages_view` where `chat` = arg_chat_id order by `id` asc;
	commit;
end $$
delimiter ;


drop procedure if exists chat_send_message;
delimiter $$
create procedure chat_send_message(in arg_chat_id BIGINT, in arg_user_id BIGINT, in arg_message_text TEXT, 
	in arg_attachment_file_path TEXT, in arg_attachment_mime_type VARCHAR(45))
begin
	declare var_attachment_fk BIGINT default null;
	set autocommit = 0;
	start transaction;
		if user_is_on_chat(arg_user_id, arg_chat_id) then
			-- If user is on this chat:
            
			-- If the attachment related attributes isn't null, then:
            if arg_attachment_file_path is not null and arg_attachment_mime_type is not null then
				insert into `attachment` (`file_path`, `mime_type`) values (arg_attachment_file_path, arg_attachment_mime_type);
                set var_attachment_fk = LAST_INSERT_ID();
			end if;
        
			-- Recording the message:
            insert into `message` (`text`, `origin_user_fk`, `chat_fk`, `attachment_fk`) values (arg_message_text, arg_user_id, arg_chat_id, var_attachment_fk);
            
            
            -- Returns the created message:
			select * from `chat_messages_view` where `chat_messages_view`.`id` = LAST_INSERT_ID();
        else
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User can\'t send messages to this chat';
			rollback;
        end if;
	commit;
end $$
delimiter ;
