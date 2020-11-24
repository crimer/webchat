using ApplicationCore.Interfaces;
using System.Threading.Tasks;

namespace ApplicationCore.Services
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository _chatRepository;
        private readonly IUserRepository _userRepository;
        public ChatService(IChatRepository chatRepository, IUserRepository userRepository)
        {
            _chatRepository = chatRepository;
            _userRepository = userRepository;
        }
        public async Task<bool> CreateNewChat(string chatName, int chatTypeId, int userCreatorId, int? mediaId)
        {
            int createdChatId = await _chatRepository.CreateNewChat(chatName, chatTypeId, mediaId);
            var subscribeSuccess = await _userRepository.SubscribeUserToChat(userCreatorId, createdChatId, 1);
            return subscribeSuccess;
        }
    }
}
