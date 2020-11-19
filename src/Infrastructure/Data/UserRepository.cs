using ApplicationCore.Entities;
using ApplicationCore.Interfaces;
using Infrastructure.Interfaces;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
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
        public async Task<bool> CreateNewUser(string login, string password, int? avatarId)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@login", login),
                new SqlParameter("@password", password),
                new SqlParameter("@avatarId", avatarId)
            };
            var addedRows = await _dataAccess.ExecuteProcedureAsync("CreateNewUser", parameters);

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
            var addedRows = await _dataAccess.ExecuteProcedureAsync("SubscribeUserToChat", parameters);

            return addedRows > 0;
        }

        public async Task<User> GetUserByLogin(string login)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@userLogin", login),
            };
            var dataReader = await _dataAccess.GetProcedureDataAsync<User>("GetUserByLogin", parameters,
                reader => new User()
                {
                    Id = _dataAccess.GetValue<int>(reader, "Id"),
                    Login = _dataAccess.GetValue<string>(reader, "Login"),
                    Password = _dataAccess.GetValue<string>(reader, "Password"),
                    MediaId = _dataAccess.GetValue<int>(reader, "MediaId")
                });

            return dataReader.FirstOrDefault();
        }
    }
}
