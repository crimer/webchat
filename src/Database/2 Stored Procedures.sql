USE WebChat
-- �������� ������ ����
GO

CREATE PROC CreateNewChat
	@name NVARCHAR(50),
	@chatType INT,
	@mediaId INT = Null
AS
BEGIN
	INSERT INTO Chats ([Name], ChatType, MediaId) VALUES (@name, @chatType, @mediaId)
END;
GO

-- �������� ������ ������������ (��� �����������)
CREATE PROC CreateNewUser
	@login NVARCHAR(50),
	@password NVARCHAR(50),
	@avatarId INT = NULL
AS
BEGIN
	INSERT INTO Users ([Login], [Password], MediaId) VALUES (@login, @password, @avatarId)
END;
GO

-- ���������� ��������
CREATE PROC CreateNewMedia
	@name NVARCHAR(255),
	@path NVARCHAR(255),
	@mimeType NVARCHAR(50) = NULL
AS
BEGIN
	INSERT INTO Media ([Name], [Path], MimeType) VALUES (@name, @path, @mimeType)
END;
GO

-- ������������ ���������� �� ��� (@userRoleId ���� �� ��������� - Member)
CREATE PROC SubscribeUserToChat
	@userId INT,
	@chatId INT,
	@userRoleId INT = 3
AS
BEGIN
	INSERT INTO ChatToUser (UserId, ChatId, UserRoleId) VALUES (@userId, @chatId, @userRoleId)
END;
GO

-- ����� ���������
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

-- ��������� ������������ �� ������
CREATE PROC GetUserByLoginAndPassword
	@userLogin NVARCHAR(50),
	@userPassword NVARCHAR(50)
AS
BEGIN
	SELECT Id,Login,Password,MediaId FROM [Users] WHERE [Login] = @userLogin AND [Password] = @userPassword;
END;
GO

-- ��������� ���� ��������� ������������� ����
CREATE PROC GetChatMessages
	@chatId INT
AS
BEGIN
	SELECT [Messages].Id, [Messages].Text, [Messages].CreatedAt, [Messages].ChatId, [Users].[Login], [Messages].UserId, [Messages].MediaId, [Messages].ReplyId
	FROM [Messages] JOIN [Users] ON [Messages].UserId = [Users].Id
	WHERE [Messages].ChatId = @chatId
	ORDER BY [Messages].CreatedAt;
END;
GO

-- ��������� ���� �����
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

-- �������� ���� �� Id
-- CREATE PROC DeleteChatById
-- 	@chatId INT
-- AS
-- BEGIN

-- END;
-- GO

--EXEC CreateNewChat 'C# (Ru)', 1
--EXEC CreateNewUser 'nikita', 'nikita'
--EXEC CreateNewMessage 'Hello everyone', 1, 1
--EXEC GetChatMessages 1
--EXEC GetUserByLogin 'nikita'