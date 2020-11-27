using System.Threading.Tasks;

namespace ApplicationCore.Interfaces
{
    public interface IMessageRepository
    {
        Task<bool> CreateNewMessage(string text, int userId, int chatId, int? mediaId, int? replyId);
        Task<bool> CreateNewMedia(string name, string path, string? mimeType = null);
    }
}
