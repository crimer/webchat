using ApplicationCore.Entities;
using ApplicationCore.Interfaces;
using Infrastructure.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class ChatRepository : IChatRepository
    {
        private readonly IDataAccess _dataAccess;
        public ChatRepository(IDataAccess dataAccess)
        {
            _dataAccess = dataAccess;
        }

        public async Task<bool> ChangeChatNameAsync(int chatId, string newChatName)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@chatId", chatId),
                new SqlParameter("@newChatName", newChatName),
            };
            var dataReader = await _dataAccess.ExecuteProcedureAsync("ChangeChatName", parameters);
                
            return dataReader > 0;
        }

        public async Task<bool> ChangeUserRoleAsync(int chatId, int userId, int userRoleId)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@chatId", chatId),
                new SqlParameter("@userId", userId),
                new SqlParameter("@userRoleId", userRoleId),
            };
            var dataReader = await _dataAccess.ExecuteProcedureAsync("ChangeUserRole", parameters);

            return dataReader > 0;
        }

        public async Task<int> CreateNewChatAsync(string chatName, int chatTypeId)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@name", chatName),
                new SqlParameter("@chatType", chatTypeId),
            };

            SqlParameter createdChatIdParam = new SqlParameter("@createdChatId", SqlDbType.Int);
            createdChatIdParam.Direction = ParameterDirection.Output;
            parameters.Add(createdChatIdParam);

            await _dataAccess.ExecuteProcedureAsync("CreateNewChat", parameters);
            return (int)createdChatIdParam.Value;
        }

        public async Task<IEnumerable<Chat>> GetAllChatsByUserIdAsync(int userId)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@userId", userId),
            };
            var dataReader = await _dataAccess.GetProcedureDataAsync<Chat>("GetAllChatsByUserId", parameters,
                reader => new Chat()
                {
                    Id = AdoDataAccess.GetValue<int>(reader, "Id"),
                    Name = AdoDataAccess.GetValue<string>(reader, "Name"),
                    ChatType = (ChatType)AdoDataAccess.GetValue<int>(reader, "ChatType"),
                });

            if (dataReader == null || dataReader.Count() == 0)
                return Enumerable.Empty<Chat>();
            else
                return dataReader;
        }

        public async Task<Chat> GetChatAsync(int chatId)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@chatId", chatId),
            };
            var dataReader = await _dataAccess.GetProcedureDataAsync<Chat>("GetChat", parameters,
                reader => new Chat()
                {
                    Id = AdoDataAccess.GetValue<int>(reader, "Id"),
                    ChatType = AdoDataAccess.GetValue<ChatType>(reader, "ChatType"),
                    Name = AdoDataAccess.GetValue<string>(reader, "Name"),
                });

            
            return dataReader.FirstOrDefault();
        }

        public async Task<IEnumerable<ChatMember>> GetChatMembersAsync(int chatId)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@chatId", chatId),
            };
            var dataReader = await _dataAccess.GetProcedureDataAsync<ChatMember>("GetChatMembers", parameters,
                reader => new ChatMember()
                {
                    Id = AdoDataAccess.GetValue<int>(reader, "Id"),
                    Login = AdoDataAccess.GetValue<string>(reader, "Login"),
                    UserRoleId = AdoDataAccess.GetValue<int>(reader, "UserRoleId"),
                });

            if (dataReader == null || dataReader.Count() == 0)
                return Enumerable.Empty<ChatMember>();
            else
                return dataReader;
        }

        public async Task<IEnumerable<Message>> GetChatMessagesByIdAsync(int id)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@chatId", id),
            };
            var dataReader = await _dataAccess.GetProcedureDataAsync<Message>("GetChatMessages", parameters,
                reader => new Message()
                {
                    Id = AdoDataAccess.GetValue<int>(reader, "Id"),
                    Text = AdoDataAccess.GetValue<string>(reader, "Text"),
                    CreatedAt = AdoDataAccess.GetValue<DateTime>(reader, "CreatedAt"),
                    ChatId = AdoDataAccess.GetValue<int>(reader, "ChatId"),
                    AuthorLogin = AdoDataAccess.GetValue<string>(reader, "Login"),
                    UserId = AdoDataAccess.GetValue<int>(reader, "UserId"),
                    IsPinned = AdoDataAccess.GetValue<bool>(reader, "IsPinned"),
                });

            if (dataReader == null || dataReader.Count() == 0)
                return Enumerable.Empty<Message>();
            else
                return dataReader;
        }

        public async Task<IEnumerable<Message>> GetPinnedMessagesByChatIdAsync(int id)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@chatId", id),
            };
            var dataReader = await _dataAccess.GetProcedureDataAsync<Message>("GetPinnedMessagesByChatId", parameters,
                reader => new Message()
                {
                    Id = AdoDataAccess.GetValue<int>(reader, "Id"),
                    Text = AdoDataAccess.GetValue<string>(reader, "Text"),
                    CreatedAt = AdoDataAccess.GetValue<DateTime>(reader, "CreatedAt"),
                    ChatId = AdoDataAccess.GetValue<int>(reader, "ChatId"),
                    AuthorLogin = AdoDataAccess.GetValue<string>(reader, "Login"),
                    UserId = AdoDataAccess.GetValue<int>(reader, "UserId"),
                    IsPinned = AdoDataAccess.GetValue<bool>(reader, "IsPinned"),
                });

            if (dataReader == null || dataReader.Count() == 0)
                return Enumerable.Empty<Message>();
            else
                return dataReader;
        }
        public async Task<bool> SubscribeUserToChatAsync(int chatId, int userId, int? userRoleId = 3)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@userId", userId),
                new SqlParameter("@chatId", chatId),
                new SqlParameter("@memberStatus", 1),
                new SqlParameter("@userRoleId", userRoleId),
            };
            var addedRows = await _dataAccess.ExecuteProcedureAsync("SubscribeUserToChat", parameters);

            return addedRows > 0;
        }
        public async Task<bool> ChangeMemberStatusInChatAsync(int chatId, int userId, int memberStatus)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@userId", userId),
                new SqlParameter("@chatId", chatId),
                new SqlParameter("@memberStatus", memberStatus),
            };
            var addedRows = await _dataAccess.ExecuteProcedureAsync("ChangeMemberStatus", parameters);

            return addedRows > 0;
        }

        public async Task<IEnumerable<Chat>> GetChatsToReturnByUserIdAsync(int userId)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@userId", userId),
            };
            var dataReader = await _dataAccess.GetProcedureDataAsync<Chat>("GetChatsToReturnByUserId", parameters,
                reader => new Chat()
                {
                    Id = AdoDataAccess.GetValue<int>(reader, "Id"),
                    Name = AdoDataAccess.GetValue<string>(reader, "Name"),
                    ChatType = (ChatType)AdoDataAccess.GetValue<int>(reader, "ChatType"),
                });

            if (dataReader == null || dataReader.Count() == 0)
                return Enumerable.Empty<Chat>();
            else
                return dataReader;
        }

        public async Task<bool> ReturnUserToChatAsync(int chatId, int userId)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@chatId", chatId),
                new SqlParameter("@userId", userId),
            };
            var dataReader = await _dataAccess.ExecuteProcedureAsync("ReturnUserToChat", parameters);

            return dataReader > 0;
        }
    }
}
