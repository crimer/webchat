using ApplicationCore.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ApplicationCore.Interfaces
{
    public interface IChatRepository
    {
        public Task<IEnumerable<Message>> GetChatMessagesById(int id);
        public Task<bool> CreateNewChat(string chatName, int chatTypeId, int mediaId);
        public Task<IEnumerable<Chat>> GetAllChatsByUserId(int userId);
    }
}
