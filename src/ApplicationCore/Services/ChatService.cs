using ApplicationCore.Interfaces;
using System.Collections.Generic;
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

        public async Task ChangeChatNameAsync(int chatId, string newChatName)
        {
            await _chatRepository.ChangeChatName(chatId, newChatName);
        }

        public async Task ChangeUserRoleAsync(int chatId, int userId, int userRoleId)
        {
            await _chatRepository.ChangeChatName(chatId, userId, userRoleId);
        }

        public async Task<bool> CreateNewChatAsync(string chatName, int chatTypeId, int userCreatorId, int? mediaId)
        {
            int createdChatId = await _chatRepository.CreateNewChat(chatName, chatTypeId, mediaId);
            var subscribeSuccess = await _chatRepository.SubscribeUserToChat(userCreatorId, createdChatId, 1);
            return subscribeSuccess;
        }

        public async Task InviteMembersToChatAsync(int chatId, IEnumerable<int> usersIds)
        {
            foreach (var userId in usersIds)
            {
                var member = await _userRepository.GetChatMember(chatId, userId);
                if(member == null)
                {
                    await _chatRepository.SubscribeUserToChat(chatId, userId);
                }
                else if(member.MemberStatusId == 2)
                {
                    await _chatRepository.BackUserToChat(chatId, userId);
                }
            }
        }

    }
}
