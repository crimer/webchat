using ApplicationCore.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ApplicationCore.Interfaces
{
    public interface IChatRepository
    {
        Task<IEnumerable<Message>> GetChatMessagesByIdAsync(int id);
        Task<IEnumerable<Message>> GetPinnedMessagesByChatIdAsync(int id);
        Task<int> CreateNewChatAsync(string chatName, int chatTypeId, int? mediaId);
        Task<IEnumerable<Chat>> GetAllChatsByUserIdAsync(int userId);
        Task<IEnumerable<Chat>> GetChatsToReturnByUserIdAsync(int userId);
        Task<IEnumerable<ChatMember>> GetChatMembersAsync(int chatId);
        Task<Chat> GetChatAsync(int chatId);
        Task<bool> SubscribeUserToChatAsync(int chatId, int userId, int? userRole = 3);
        Task<bool> ChangeChatNameAsync(int chatId, string newChatName);
        Task<bool> ChangeUserRoleAsync(int chatId, int userId, int userRoleId);
        Task<bool> UserLaveChatAsync(int chatId, int userId);
        Task<bool> AdminKikUserAsync(int chatId, int userId);
        Task<bool> BackUserToChatAsync(int chatId, int userId);
        Task<bool> ReturnUserToChatAsync(int chatId, int userId);
    }
}
