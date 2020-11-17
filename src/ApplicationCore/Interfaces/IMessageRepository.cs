using System.Threading.Tasks;

namespace ApplicationCore.Interfaces
{
    public interface IMessageRepository
    {
        public Task<bool> CreateNewMessage(string text, int userId, int chatId, int mediaId, int replyId);
        public Task<bool> CreateNewMedia(string name, string path, string mimeType = null);
    }
}
