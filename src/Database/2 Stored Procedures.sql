USE WebChat
GO

CREATE PROC CreateNewChat
	@name NVARCHAR(50),
	@chatType INT,
	@createdChatId INT OUTPUT
AS
BEGIN
	INSERT INTO Chats ([Name], ChatType) VALUES (@name, @chatType)
	SELECT @createdChatId = SCOPE_IDENTITY();
END;
GO

CREATE PROC CreateNewUser
	@login NVARCHAR(50),
	@password NVARCHAR(50)
AS
BEGIN
	INSERT INTO Users ([Login], [Password]) VALUES (@login, @password)
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
	@createdMessageId INT OUTPUT
AS
BEGIN
	INSERT INTO [Messages] (Text, UserId, ChatId, CreatedAt) VALUES	(@text, @userId, @chatId, GETDATE());
	SELECT @createdMessageId = SCOPE_IDENTITY();
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
	SELECT Id, Login, Password FROM [Users]
	WHERE Id = @userId;
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
	SELECT [Messages].Id, [Messages].Text, [Messages].CreatedAt, [Messages].ChatId, [Users].[Login], [Messages].UserId, [Messages].IsPinned
	FROM [Messages] JOIN [Users] ON [Messages].UserId = [Users].Id
	WHERE [Messages].ChatId = @chatId
	ORDER BY [Messages].CreatedAt;
END;
GO

CREATE PROC GetChatMessage
	@messageId INT
AS
BEGIN
	SELECT [Messages].Id, [Messages].Text, [Messages].CreatedAt, [Messages].ChatId, [Users].[Login], [Messages].UserId, [Messages].IsPinned
	FROM [Messages] JOIN [Users] ON [Messages].UserId = [Users].Id
	WHERE [Messages].Id = @messageId
	ORDER BY [Messages].CreatedAt;
END;
GO


CREATE PROC TogglePinMessage
	@messageId INT,
	@isPin BIT
AS
BEGIN
	UPDATE [Messages]
	SET IsPinned = @isPin
	WHERE [Messages].Id = @messageId;
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
	SELECT [Messages].Id, [Messages].Text, [Messages].CreatedAt, [Messages].ChatId, [Users].[Login], [Messages].UserId, [Messages].IsPinned
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

CREATE PROC ChangeUserPassword
 	@userId INT,
	@newPassword NVARCHAR(50)
 AS
 BEGIN
	UPDATE [Users] 
	SET [Password] = @newPassword
	WHERE Id = @userId;
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
 

--EXEC CreateNewMessage 'Hello everyone', 1, 1