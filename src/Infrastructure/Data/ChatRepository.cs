using ApplicationCore.Entities;
using ApplicationCore.Interfaces;
using Infrastructure.Interfaces;
using System;
using System.Collections.Generic;
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
        public async Task<bool> CreateNewChat(string chatName, int chatTypeId, int mediaId)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@name", chatName),
                new SqlParameter("@chatType", chatTypeId),
                new SqlParameter("@mediaId", mediaId),
            };
            var addedRows = await _dataAccess.ExecuteNonQueryAsync("CreateNewChat", parameters);

            return addedRows > 0;
        }

        public async Task<IEnumerable<Message>> GetChatMessagesById(int id)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@chatId", id),
            };
            var dataReader = await _dataAccess.GetDataReaderAsync("GetUserByLogin", parameters);

            List<Message> messages = new List<Message>();

            if (dataReader != null && dataReader.HasRows)
            {
                while (dataReader.Read())
                {
                    int rowId = dataReader.GetInt32(0);
                    string text = dataReader.GetString(1);
                    DateTime createdAt = dataReader.GetDateTime(2);
                    int userId = dataReader.GetInt32(3);
                    int chatId = dataReader.GetInt32(4);
                    int mediaId = dataReader.GetInt32(5);
                    int replyId = dataReader.GetInt32(6);

                    messages.Add(new Message()
                    {
                        Id = rowId,
                        Text = text,
                        CreatedAt = createdAt,
                        UserId = userId,
                        ChatId = chatId,
                        MediaId = mediaId,
                        ReplyId = replyId
                    });
                }
            }
            else
            {
                return Enumerable.Empty<Message>();
            }
            return messages;
        }
    }
}
