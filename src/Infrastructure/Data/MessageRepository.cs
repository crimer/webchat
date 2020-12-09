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
    public class MessageRepository : IMessageRepository
    {
        private readonly IDataAccess _dataAccess;
        public MessageRepository(IDataAccess dataAccess)
        {
            _dataAccess = dataAccess;
        }
        public async Task<int> CreateNewMessageAsync(string text, int userId, int chatId)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@text", text),
                new SqlParameter("@userId", userId),
                new SqlParameter("@chatId", chatId)
            };

            SqlParameter createdChatIdParam = new SqlParameter("@createdMessageId", SqlDbType.Int);
            createdChatIdParam.Direction = ParameterDirection.Output;
            parameters.Add(createdChatIdParam);

            await _dataAccess.ExecuteProcedureAsync("CreateNewMessage", parameters);
            return (int)createdChatIdParam.Value;
        }

        public async Task<Message> GetMessageByIdAsync(int messageId)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@messageId", messageId),
            };
            var dataReader = await _dataAccess.GetProcedureDataAsync<Message>("GetChatMessage", parameters,
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
            return dataReader.FirstOrDefault();
        }

        public async Task<bool> PinMessageByIdAsync(int messageId, bool isPin)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@messageId", messageId),
                new SqlParameter("@isPin", isPin),
            };
            var addedRows = await _dataAccess.ExecuteProcedureAsync("TogglePinMessage", parameters);

            return addedRows > 0;
        }
    }
}