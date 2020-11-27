using ApplicationCore.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ApplicationCore.Interfaces
{
    public interface IUserRepository
    {
        Task<User> GetUser(string login, string password);
        Task<bool> CreateNewUser(string login, string password, int? avatarId);
        Task<IEnumerable<User>> SearchUsersByLogin(string userLogin);
    }
}
