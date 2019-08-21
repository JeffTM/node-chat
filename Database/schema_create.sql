drop database if exists NodeChat;
create database NodeChat;
use NodeChat;

create table User (
	UserID int primary key auto_increment,
    Username nvarchar(25) unique not null,
    Password varchar(25) not null
);

create table GroupChat (
	GroupChatID int primary key auto_increment,
    CreatingUserID int not null,
    
    foreign key (CreatingUserID) references User (UserID)
);

create table GroupMember (
	GroupMemberID int primary key auto_increment,
    GroupChatID int not null,
    UserID int not null,
    IsAdmin bit(1) not null,
    
    foreign key (GroupChatID) references GroupChat (GroupChatID),
    foreign key (UserID) references User (UserID),
    unique (GroupChatID, UserID)
);

create table Message (
	MessageID int primary key auto_increment,
    GroupChatID int not null,
    UserID int not null,
    PostDateTime datetime not null,
    text nvarchar(1000),
    
	foreign key (GroupChatID) references GroupChat (GroupChatID),
    foreign key (UserID) references User (UserID)
);

create table MessageLikes (
	MessageID int not null,
    GroupMemberID int not null,
    
    primary key (MessageID, GroupMemberID),
    foreign key (MessageID) references Message (MessageID),
    foreign key (GroupMemberID) references GroupMember (GroupMemberID)
);

/*Fix for ER_NOT_SUPPORTED_AUTH_MODE*/
/*	ALTER USER 'nodechat'@'localhost' IDENTIFIED WITH mysql_native_password BY 'nodechat';	*/
