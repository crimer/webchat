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
        Task<IEnumerable<User>> GetChatMembers(int chatId);
        Task<Chat> GetChat(int chatId);
    }
}
