using ApplicationCore.Interfaces;
using Infrastructure.Interfaces;
using System.Collections.Generic;
using System.Data.SqlClient;
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
        public async Task<bool> CreateNewMessage(string text, int userId, int chatId, int mediaId, int replyId)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@text", text),
                new SqlParameter("@userId", userId),
                new SqlParameter("@chatId", chatId),
                new SqlParameter("@mediaId", mediaId),
                new SqlParameter("@replyId", replyId)
            };
            var addedRows = await _dataAccess.ExecuteProcedureAsync("CreateNewMessage", parameters);

            return addedRows > 0;
        }

        public async Task<bool> CreateNewMedia(string name, string path, string mimeType = null)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@name", name),
                new SqlParameter("@path", path),
                new SqlParameter("@mimeType", mimeType)
            };
            var addedRows = await _dataAccess.ExecuteProcedureAsync("CreateNewMedia", parameters);

            return addedRows > 0;
        }
    }
}