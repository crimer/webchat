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
            var addedRows = await _dataAccess.ExecuteProcedureAsync("CreateNewChat", parameters);

            return addedRows > 0;
        }

        public async Task<IEnumerable<Message>> GetChatMessagesById(int id)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@chatId", id),
            };
            var dataReader = await _dataAccess.GetProcedureDataAsync<Message>("GetChatMessages", parameters,
                reader => new Message()
                {
                    Id = _dataAccess.GetValue<int>(reader, "Id"),
                    Text = _dataAccess.GetValue<string>(reader, "Text"),
                    CreatedAt = _dataAccess.GetValue<DateTime>(reader, "CreatedAt"),
                    ChatId = _dataAccess.GetValue<int>(reader, "ChatId"),
                    AuthorLogin = _dataAccess.GetValue<string>(reader, "Login")
                    //UserId = _dataAccess.GetValue<int>(reader, "UserId"),
                    //MediaId = _dataAccess.GetValue<int>(reader, "MediaId"),
                    //ReplyId = _dataAccess.GetValue<int>(reader, "ReplyId")
                });

            if (dataReader == null || dataReader.Count() == 0)
                return Enumerable.Empty<Message>();
            else
                return dataReader;
        }
    }
}
