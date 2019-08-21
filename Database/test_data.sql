use NodeChat;

insert into user (username, password) values
('jeff', 'test'),
('bob', 'test');

insert into groupchat (CreatingUserID) values
(1);

insert into groupmember (GroupChatID, UserID, IsAdmin) values
(1, 2, 0);