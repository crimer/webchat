using ApplicationCore.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ApplicationCore.Interfaces
{
    public interface IChatRepository
    {
        Task<IEnumerable<Message>> GetChatMessagesById(int id);
        Task<IEnumerable<Message>> GetPinnedMessagesByChatId(int id);
        Task<int> CreateNewChat(string chatName, int chatTypeId, int? mediaId);
        Task<IEnumerable<Chat>> GetAllChatsByUserId(int userId);
        Task<IEnumerable<Chat>> GetChatsToReturnByUserId(int userId);
        Task<IEnumerable<ChatMember>> GetChatMembers(int chatId);
        Task<Chat> GetChat(int chatId);
        Task<bool> SubscribeUserToChat(int chatId, int userId, int? userRole = 3);
        Task<bool> ChangeChatName(int chatId, string newChatName);
        Task<bool> ChangeChatName(int chatId, int userId, int userRoleId);
        Task<bool> UserLaveChat(int chatId, int userId);
        Task<bool> AdminKikUser(int chatId, int userId);
        Task<bool> BackUserToChat(int chatId, int userId);
        Task<bool> ReturnUserToChat(int chatId, int userId);
    }
}
