USE WebChat
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

CREATE PROC CreateNewMedia
	@name NVARCHAR(255),
	@path NVARCHAR(255),
	@mimeType NVARCHAR(50) = NULL
AS
BEGIN
	INSERT INTO Media ([Name], [Path], MimeType) VALUES (@name, @path, @mimeType)
END;
GO

CREATE PROC SubscribeUserToChat
	@userId INT,
	@chatId INT,
	@userRoleId INT = 3
AS
BEGIN
	INSERT INTO ChatToUser (UserId, ChatId, UserRoleId) VALUES (@userId, @chatId, @userRoleId)
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
	SELECT [Users].Id, Login, Password FROM [Users] 
	JOIN ChatToUser ON ChatToUser.UserId = [Users].Id
	JOIN UserRoles ON UserRoles.Id = ChatToUser.UserRoleId
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
	SELECT [Users].Id, Login, Password, UserRoles.Id as UserRoleId FROM [Users] 
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
	JOIN [Users] ON [Users].Id = [ChatToUser].UserId
	WHERE [Users].Id = @userId;

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
	WHERE [Chats].Id = @chatId;
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

 

--EXEC CreateNewMessage 'Hello everyone', 1, 1