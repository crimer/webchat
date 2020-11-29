using System.Collections.Generic;
using System.Threading.Tasks;

namespace ApplicationCore.Interfaces
{
    public interface IChatService
    {
        Task<bool> CreateNewChat(string chatName, int chatTypeId, int userCreatorId, int? mediaId);
        Task InviteMembersToChat(int chatId, IEnumerable<int> usersIds);
        Task ChangeChatName(int chatId, string newChatName);
    }
}
