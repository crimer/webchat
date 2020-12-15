using System.Collections.Generic;
using System.Threading.Tasks;

namespace ApplicationCore.Interfaces
{
    public interface IChatService
    {
        Task<bool> CreateNewChatAsync(string chatName, int chatTypeId, int userCreatorId);
        Task InviteMembersToChatAsync(int chatId, IEnumerable<int> usersIds);
        Task ChangeChatNameAsync(int chatId, string newChatName);
        Task ChangeUserRoleAsync(int chatId, int userId, int userRoleId);
        Task<bool> BackToChatAsync(int chatId, int userId);
        Task<int> CreateDirectChatAsync(int userId, int memberId);
    }
}
