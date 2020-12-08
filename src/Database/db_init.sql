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



GO

CREATE PROC CreateNewChat
	@name NVARCHAR(50),
	@chatType INT,
	@mediaId INT = Null,
	@createdChatId INT OUTPUT
AS
BEGIN
	INSERT INTO Chats ([Name], ChatType, MediaId) VALUES (@name, @chatType, @mediaId)
	SELECT @createdChatId = SCOPE_IDENTITY();
END;
GO

CREATE PROC CreateNewUser
	@login NVARCHAR(50),
	@password NVARCHAR(50),
	@avatarId INT = NULL
AS
BEGIN
	INSERT INTO Users ([Login], [Password], MediaId) VALUES (@login, @password, @avatarId)
END;
GO

CREATE PROC SubscribeUserToChat
	@userId INT,
	@chatId INT,
	@memberStatus INT,
	@userRoleId INT = 1
AS
BEGIN
	INSERT INTO ChatToUser (UserId, ChatId, UserRoleId, MemberStatusId) VALUES (@userId, @chatId, @userRoleId, @memberStatus)
END;
GO

CREATE PROC CreateNewMessage
	@text NVARCHAR(MAX),
	@userId INT,
	@chatId INT,
	@mediaId INT = NULL,
	@replyId INT = NULL
AS
BEGIN
	INSERT INTO [Messages] (Text, UserId, ChatId, CreatedAt, MediaId, ReplyId) VALUES
	(@text, @userId, @chatId, GETDATE(), @mediaId, @replyId)
END;
GO

CREATE PROC GetUserByLoginAndPassword
	@userLogin NVARCHAR(50),
	@userPassword NVARCHAR(50)
AS
BEGIN
	SELECT Id, Login, Password FROM [Users]
	WHERE [Login] = @userLogin AND [Password] = @userPassword;
END;
GO

CREATE PROC GetUserById
	@userId INT
AS
BEGIN
	SELECT [Users].Id, Login, Password FROM [Users]
	JOIN ChatToUser ON ChatToUser.UserId = [Users].Id
	JOIN UserRoles ON UserRoles.Id = ChatToUser.UserRoleId
	WHERE [Users].Id = @userId;
END;
GO


CREATE PROC GetChatMember
	@userId INT,
	@chatId INT
AS
BEGIN
	SELECT [Users].Id, [Users].Login, [Users].Password, UserRoles.Id as UserRoleId, ChatToUser.MemberStatusId FROM [Users]
	JOIN ChatToUser ON ChatToUser.UserId = [Users].Id
	JOIN UserRoles ON UserRoles.Id = ChatToUser.UserRoleId
	WHERE [Users].Id = @userId AND ChatToUser.ChatId = @chatId;
END;
GO

CREATE PROC GetChatMessages
	@chatId INT
AS
BEGIN
	SELECT [Messages].Id, [Messages].Text, [Messages].CreatedAt, [Messages].ChatId, [Users].[Login], [Messages].UserId, [Messages].MediaId, [Messages].ReplyId, [Messages].IsPinned
	FROM [Messages] JOIN [Users] ON [Messages].UserId = [Users].Id
	WHERE [Messages].ChatId = @chatId
	ORDER BY [Messages].CreatedAt;
END;
GO

CREATE PROC GetAllChatsByUserId
	@userId INT
AS
BEGIN
	SELECT [Chats].Id, [Chats].Name, [Chats].ChatType
	FROM [Chats]
	JOIN [ChatToUser] ON [Chats].Id = [ChatToUser].ChatId
	WHERE [ChatToUser].UserId = @userId AND [ChatToUser].MemberStatusId = 1;

END;
GO

CREATE PROC GetChatsToReturnByUserId
	@userId INT
AS
BEGIN
	SELECT [Chats].Id, [Chats].Name, [Chats].ChatType
	FROM [Chats]
	JOIN [ChatToUser] ON [Chats].Id = [ChatToUser].ChatId
	WHERE [ChatToUser].UserId = @userId AND [ChatToUser].MemberStatusId = 2;

END;
GO


CREATE PROC GetPinnedMessagesByChatId
	@chatId INT
AS
BEGIN
	SELECT [Messages].Id, [Messages].Text, [Messages].CreatedAt, [Messages].ChatId, [Users].[Login], [Messages].UserId, [Messages].MediaId, [Messages].ReplyId, [Messages].IsPinned
	FROM [Messages] JOIN [Users] ON [Messages].UserId = [Users].Id
	WHERE [Messages].ChatId = @chatId AND [Messages].IsPinned = 1
	ORDER BY [Messages].CreatedAt;

END;
GO

CREATE PROC ChangeChatName
 	@chatId INT,
	@newChatName NVARCHAR(50)
 AS
 BEGIN
	UPDATE [Chats]
	SET [Name] = @newChatName
	WHERE Id = @chatId;
 END;
 GO


CREATE PROC ReturnUserToChat
 	@chatId INT,
	@userId INT
 AS
 BEGIN
	UPDATE [ChatToUser]
	SET [MemberStatusId] = 1
	WHERE ChatId = @chatId AND UserId = @userId;
 END;
 GO

CREATE PROC ChangeUserRole
 	@chatId INT,
	@userId INT,
	@userRoleId INT
 AS
 BEGIN
	UPDATE [ChatToUser]
	SET UserRoleId = @userRoleId
	WHERE [ChatToUser].ChatId = @chatId AND [ChatToUser].UserId = @userId;
 END;
 GO


 CREATE PROC GetChat
 	@chatId INT
 AS
 BEGIN
	SELECT [Chats].Id, [Chats].Name, [Chats].ChatType
	FROM [Chats] JOIN ChatTypes ON [Chats].ChatType = ChatTypes.Id
	WHERE [Chats].Id = @chatId;
 END;
 GO

 CREATE PROC GetChatMembers
 	@chatId INT
 AS
 BEGIN
	SELECT [Users].Id, [Users].Login, ChatToUser.UserRoleId
	FROM [Chats]
	JOIN ChatToUser ON  ChatToUser.ChatId = [Chats].Id
	JOIN [Users] ON  ChatToUser.UserId = [Users].Id
	WHERE [Chats].Id = @chatId AND ChatToUser.MemberStatusId = 1;
 END;
 GO

 CREATE PROC SearchUsersByLogin
 	@userLogin NVARCHAR(50)
 AS
 BEGIN
	SELECT [Users].Id, [Users].Login, [Users].Password
	FROM [Users]
	WHERE [Users].Login LIKE @userLogin + '%';
 END;
 GO

 CREATE PROC ChangeMemberStatus
	@chatId INT,
	@userId INT,
	@memberStatus INT
AS
BEGIN
	UPDATE [ChatToUser]
	SET [MemberStatusId] = @memberStatus
	WHERE [ChatToUser].ChatId = @chatId AND [ChatToUser].UserId = @userId;
END;
GO
