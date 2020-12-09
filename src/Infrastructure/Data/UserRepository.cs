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

        public async Task<bool> ChangeUserPasswordAsync(int userId, string newPassword)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@userId", userId),
                new SqlParameter("@newPassword", newPassword),
            };
            var addedRows = await _dataAccess.ExecuteProcedureAsync("ChangeUserPassword", parameters);

            return addedRows > 0;
        }

        public async Task<bool> CreateNewUserAsync(string login, string password)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@login", login),
                new SqlParameter("@password", password),
            };
            var addedRows = await _dataAccess.ExecuteProcedureAsync("CreateNewUser", parameters);

            return addedRows > 0;
        }

        public async Task<ChatMember> GetChatMemberAsync(int chatId, int userId)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@chatId", chatId),
                new SqlParameter("@userId", userId),
            };
            var dataReader = await _dataAccess.GetProcedureDataAsync<ChatMember>("GetChatMember", parameters,
                reader => new ChatMember()
                {
                    Id = AdoDataAccess.GetValue<int>(reader, "Id"),
                    Login = AdoDataAccess.GetValue<string>(reader, "Login"),
                    Password = AdoDataAccess.GetValue<string>(reader, "Password"),
                    UserRoleId = AdoDataAccess.GetValue<int>(reader, "UserRoleId"),
                    MemberStatusId = AdoDataAccess.GetValue<int>(reader, "MemberStatusId"),
                });

            return dataReader.FirstOrDefault();
        }

        public async Task<User> GetUserAsync(string login, string password)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@userLogin", login),
                new SqlParameter("@userPassword", password),
            };
            var dataReader = await _dataAccess.GetProcedureDataAsync<User>("GetUserByLoginAndPassword", parameters,
                reader => new User()
                {
                    Id = AdoDataAccess.GetValue<int>(reader, "Id"),
                    Login = AdoDataAccess.GetValue<string>(reader, "Login"),
                    Password = AdoDataAccess.GetValue<string>(reader, "Password"),
                });

            return dataReader.FirstOrDefault();
        }

        public async Task<User> GetUserByIdAsync(int userId)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@userId", userId),
            };
            var dataReader = await _dataAccess.GetProcedureDataAsync<User>("GetUserById", parameters,
                reader => new User()
                {
                    Id = AdoDataAccess.GetValue<int>(reader, "Id"),
                    Login = AdoDataAccess.GetValue<string>(reader, "Login"),
                    Password = AdoDataAccess.GetValue<string>(reader, "Password"),
                });

            return dataReader.FirstOrDefault();
        }

        public async Task<IEnumerable<User>> SearchUsersByLoginAsync(string userLogin)
        {
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                new SqlParameter("@userLogin", userLogin),
            };
            var dataReader = await _dataAccess.GetProcedureDataAsync<User>("SearchUsersByLogin", parameters,
                reader => new User()
                {
                    Id = AdoDataAccess.GetValue<int>(reader, "Id"),
                    Login = AdoDataAccess.GetValue<string>(reader, "Login"),
                    Password = AdoDataAccess.GetValue<string>(reader, "Password"),
                });

            if (dataReader == null || dataReader.Count() == 0)
                return Enumerable.Empty<User>();
            else
                return dataReader;
        }
    }
}
