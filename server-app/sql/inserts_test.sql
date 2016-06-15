use `echoes_schema`;


-- 22
insert into `user` (`name`, `login`, `password`) values ('Shawn Evans', 'sevans0', '7dbV2YzNOCV');
insert into `user` (`name`, `login`, `password`) values ('Frank Turner', 'fturner1', '0zkBIER1cijR');
insert into `user` (`name`, `login`, `password`) values ('Robin Tucker', 'rtucker2', 'iXBYaCZs');
insert into `user` (`name`, `login`, `password`) values ('Sara Perkins', 'sperkins3', 'BtavVxZVX26');
insert into `user` (`name`, `login`, `password`) values ('Barbara Hanson', 'bhanson4', 'cZrMV9DZ');
insert into `user` (`name`, `login`, `password`) values ('Guilherme Reginaldo', 'potentii', '123'); -- 6
insert into `user` (`name`, `login`, `password`) values ('Lillian Fields', 'lfields5', 'urPWSIaq2');
insert into `user` (`name`, `login`, `password`) values ('Chris Mccoy', 'cmccoy6', '51QEBqjX');
insert into `user` (`name`, `login`, `password`) values ('Phyllis Fox', 'pfox7', 'Qn5gfPfcPx');
insert into `user` (`name`, `login`, `password`) values ('Cynthia Gibson', 'cgibson8', '0oQUORvwj3g');
insert into `user` (`name`, `login`, `password`) values ('Kimberly Cole', 'kcole9', '9uyPqxztrZAJ');
insert into `user` (`name`, `login`, `password`) values ('Wanda Reynolds', 'wreynoldsa', 'CMaYHN');
insert into `user` (`name`, `login`, `password`) values ('Janice Davis', 'jdavisb', 'ffrS70');
insert into `user` (`name`, `login`, `password`) values ('Jurema Jurubeba', 'juru', '1');
insert into `user` (`name`, `login`, `password`) values ('Harold Kim', 'hkimc', 'bOSV8OCqU');
insert into `user` (`name`, `login`, `password`) values ('Sean Ellis', 'sellisd', 'PmpLfZUxR');
insert into `user` (`name`, `login`, `password`) values ('Marie Gibson', 'mgibsone', 'PrQjMJ');
insert into `user` (`name`, `login`, `password`) values ('Terry Roberts', 'trobertsf', 'Bgd3yLcqQ7');
insert into `user` (`name`, `login`, `password`) values ('Howard Scott', 'hscottg', '09C1syj');
insert into `user` (`name`, `login`, `password`) values ('Todd Bennett', 'tbennetth', 'mmao1u19hK');
insert into `user` (`name`, `login`, `password`) values ('Joshua Mccoy', 'jmccoyi', 'kqoysLv');
insert into `user` (`name`, `login`, `password`) values ('Rachel Hernandez', 'rhernandezj', 'GFnelVK');


-- 25
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (9, 4);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (9, 10);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (4, 20);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (15, 12);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (16, 21);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (7, 22);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (4, 17);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (5, 22);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (6, 9);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (18, 16);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (9, 21);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (2, 21);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (16, 1);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (12, 19);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (21, 3);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (21, 17);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (13, 1);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (16, 8);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (3, 17);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (9, 5);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (9, 1);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (18, 2);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (8, 17);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (6, 2);
insert into `contact` (`me_user_fk`, `contact_user_fk`) values (15, 7);


call chat_create(6, 'chat test');
call chat_add_user(1, 7);

call chat_send_message(1, 6, 'Hello', null, null);
call chat_send_message(1, 7, 'Hey', null, null);
call chat_send_message(1, 6, 'How\'re you doing?', null, null);
call chat_send_message(1, 7, 'nice, and you?', null, null);