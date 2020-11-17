using ApplicationCore.Entities;
using ApplicationCore.Interfaces;
using Infrastructure.Interfaces;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly IDataAccess _dataAccess;
        public UserRepository(IDataAccess dataAccess)
        {
            _dataAccess = dataAccess;
        }
        public async Task<bool> CreateNewUser(string login, string password, int avatarId)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@login", login),
                new SqlParameter("@password", password),
                new SqlParameter("@avatarId", avatarId)
            };
            var addedRows = await _dataAccess.ExecuteNonQueryAsync("CreateNewUser", parameters);

            return addedRows > 0;
        }

        public async Task<bool> SubscribeUserToChat(int userId, int chatId, int userRoleId)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@userId", userId),
                new SqlParameter("@chatId", chatId),
                new SqlParameter("@userRoleId", userRoleId)
            };
            var addedRows = await _dataAccess.ExecuteNonQueryAsync("SubscribeUserToChat", parameters);

            return addedRows > 0;
        }

        public async Task<User> GetUserByLogin(string login)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@userLogin", login),
            };
            var dataReader = await _dataAccess.GetDataReaderAsync("GetUserByLogin", parameters);

            User user = null;

            if (dataReader != null && dataReader.HasRows)
            {
                while (dataReader.Read())
                {
                    int id = dataReader.GetInt32(0);
                    string userLogin = dataReader.GetString(1);
                    string userPassword = dataReader.GetString(2);
                    int mediaId = dataReader.GetInt32(3);
                    user = new User()
                    {
                        Id = id,
                        Login = userLogin,
                        Password = userPassword,
                        MediaId = mediaId
                    };
                }
            }

            return user;
        }
    }
}
