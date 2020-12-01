using System.Collections.Generic;
using System.Threading.Tasks;

namespace ApplicationCore.Interfaces
{
    public interface IChatService
    {
        Task<bool> CreateNewChatAsync(string chatName, int chatTypeId, int userCreatorId, int? mediaId);
        Task InviteMembersToChatAsync(int chatId, IEnumerable<int> usersIds);
        Task ChangeChatNameAsync(int chatId, string newChatName);
        Task ChangeUserRoleAsync(int chatId, int userId, int userRoleId);
    }
}
