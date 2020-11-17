using ApplicationCore.Entities;
using System.Threading.Tasks;

namespace ApplicationCore.Interfaces
{
    public interface IUserRepository
    {
        public Task<User> GetUserByLogin(string login);
        public Task<bool> SubscribeUserToChat(int userId, int chatId, int userRoleId);
        public Task<bool> CreateNewUser(string login, string password, int avatarId);
    }
}
