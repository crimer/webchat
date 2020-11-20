using ApplicationCore.Entities;
using System.Threading.Tasks;

namespace ApplicationCore.Interfaces
{
    public interface IUserRepository
    {
        public Task<User> GetUser(string login, string password);
        public Task<bool> SubscribeUserToChat(int userId, int chatId, int userRoleId);
        public Task<bool> CreateNewUser(string login, string password, int? avatarId);
    }
}
