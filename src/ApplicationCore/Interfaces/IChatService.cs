using System.Threading.Tasks;

namespace ApplicationCore.Interfaces
{
    public interface IChatService
    {
        Task<bool> CreateNewChat(string chatName, int chatTypeId, int userCreatorId, int? mediaId);
    }
}
