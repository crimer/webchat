using ApplicationCore.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ApplicationCore.Services
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository _chatRepository;
        public ChatService(IChatRepository chatRepository)
        {
            _chatRepository = chatRepository;
        }
        public async Task<bool> CreateNewChat(string chatName, int chatTypeId, int userCreatorId, int? mediaId)
        {
            int createdChatId = await _chatRepository.CreateNewChat(chatName, chatTypeId, mediaId);
            var subscribeSuccess = await _chatRepository.SubscribeUserToChat(userCreatorId, createdChatId, 1);
            return subscribeSuccess;
        }

        public async Task InviteMembersToChat(int chatId, IEnumerable<int> usersIds)
        {
            foreach (var userId in usersIds)
            {
                await _chatRepository.SubscribeUserToChat(chatId, userId);
            }
        }
    }
}
