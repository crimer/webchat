using ApplicationCore.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ApplicationCore.Interfaces
{
    public interface IUserRepository
    {
        Task<User> GetUserAsync(string login, string password);
        Task<User> GetUserByIdAsync(int userId);
        Task<IEnumerable<User>> GetAllUsers();
        Task<ChatMember> GetChatMemberAsync(int chatId, int userId);
        Task<bool> CreateNewUserAsync(string login, string password);
        Task<bool> ChangeUserPasswordAsync(int userId, string newPassword);
        Task<IEnumerable<User>> SearchUsersByLoginAsync(string userLogin);
    }
}
