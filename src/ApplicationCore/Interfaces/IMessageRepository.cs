using ApplicationCore.Entities;
using System.Threading.Tasks;

namespace ApplicationCore.Interfaces
{
    public interface IMessageRepository
    {
        Task<int> CreateNewMessageAsync(string text, int userId, int chatId);
        Task<Message> GetMessageByIdAsync(int messageId);
        Task<bool> PinMessageByIdAsync(int messageId, bool isPin);
    }
}
