CREATE DATABASE WebChat;
GO
USE WebChat

CREATE TABLE ChatTypes (
	Id INT PRIMARY KEY IDENTITY,
	[Name] NVARCHAR(50) UNIQUE NOT NULL,
)

CREATE TABLE MemberStatus (
	Id INT PRIMARY KEY IDENTITY,
	[Name] NVARCHAR(50) UNIQUE NOT NULL,
)

CREATE TABLE UserRoles (
	Id INT PRIMARY KEY IDENTITY,
	[Name] NVARCHAR(50) UNIQUE NOT NULL,
)

CREATE TABLE Media (
	Id INT PRIMARY KEY IDENTITY,
	[Name] NVARCHAR(255) NOT NULL,
	[Path] NVARCHAR(255) NOT NULL,
	MimeType NVARCHAR(50) NULL,
)

CREATE TABLE [Users] (
	Id INT PRIMARY KEY IDENTITY,
	[Login] NVARCHAR(50) UNIQUE NOT NULL,
	[Password] NVARCHAR(50) NOT NULL,
	MediaId INT REFERENCES Media(Id) NULL,
)

CREATE TABLE Chats (
	Id INT PRIMARY KEY IDENTITY,
	[Name] NVARCHAR(50) NOT NULL,
	ChatType INT REFERENCES ChatTypes(Id) NOT NULL,
	MediaId INT REFERENCES Media(Id) NULL,
)

CREATE TABLE ChatToUser (
	Id INT PRIMARY KEY IDENTITY,
	UserId INT REFERENCES Users(Id) NOT NULL,
	ChatId INT REFERENCES Chats(Id) NOT NULL,
	UserRoleId INT REFERENCES UserRoles(Id) NOT NULL,
	MemberStatusId INT REFERENCES MemberStatus(Id) NOT NULL,
)

CREATE TABLE [Messages] (
	Id INT PRIMARY KEY IDENTITY,
	[Text] NVARCHAR(MAX),
	CreatedAt DATETIME,
	IsPinned BIT DEFAULT 0,
	UserId INT REFERENCES Users(Id) NOT NULL,
	ChatId INT REFERENCES Chats(Id) NOT NULL,
	MediaId INT REFERENCES Media(Id) NULL,
	ReplyId INT REFERENCES [Messages](Id) NULL,
)

INSERT INTO UserRoles ([Name]) VALUES 
('Administrator'),
('Manager'),
('Member');

INSERT INTO ChatTypes ([Name]) VALUES 
('Group'),
('Channel'),
('Direct');

INSERT INTO MemberStatus([Name]) VALUES 
('InChat'),
('LeaveChat'),
('KikedByAdmin');

INSERT INTO Users (Login,Password) VALUES ('nikita', 'B0-0A-50-C4-48-23-8A-71-ED-47-9F-81-FA-4D-90-66');
INSERT INTO Chats (Name,ChatType) VALUES ('C# (Ru)', 1);
INSERT INTO ChatToUser (ChatId,UserId,UserRoleId,MemberStatusId) VALUES (1, 1, 1, 1);
INSERT INTO [Messages] (Text,ChatId,UserId,CreatedAt) VALUES ('Hello everyone', 1, 1, GETDATE());

select * from ChatTypes;

--ALTER TABLE ChatToUser DROP COLUMN IsAdminRemoved;
--ALTER TABLE [ChatToUser] ADD MemberStatusId INT REFERENCES MemberStatus(Id) NULL;

--Delete ChatToUser where Id = 7