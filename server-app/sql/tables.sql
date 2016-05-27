create schema if not exists `echoes_schema`;
use `echoes_schema`;


drop table if exists `friendship`;
drop table if exists `user`;

create table if not exists `user`(
	`id` BIGINT unsigned not null auto_increment unique,
    `name` TEXT not null,
    `login` VARCHAR(45) not null unique,
    `password` VARCHAR(16) not null,
    
    primary key(`id`)
);

create table if not exists `friendship`(
	`id` BIGINT unsigned not null auto_increment unique,
    `user_one_id_fk` BIGINT unsigned not null,
    `user_two_id_fk` BIGINT unsigned not null,
    
    foreign key(`user_one_id_fk`) references `user`(`id`),
    foreign key(`user_two_id_fk`) references `user`(`id`),
    primary key(`id`)
);


create fulltext index `user_fulltext_index` on `user`(`name`);

