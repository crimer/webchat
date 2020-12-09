using ApplicationCore.Entities;
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

        public async Task<bool> BackToChatAsync(int chatId, int userId)
        {
            ChatMember chatMember = await _userRepository.GetChatMemberAsync(chatId, userId);
            bool isSuccessReturn = false;

            if (chatMember.MemberStatusId == 2)
                isSuccessReturn = await _chatRepository.ReturnUserToChatAsync(chatId, userId);

            return isSuccessReturn;
        }

        public Task ChangeChatNameAsync(int chatId, string newChatName)
        {
            return _chatRepository.ChangeChatNameAsync(chatId, newChatName);
        }

        public Task ChangeUserRoleAsync(int chatId, int userId, int userRoleId)
        {
            return _chatRepository.ChangeUserRoleAsync(chatId, userId, userRoleId);
        }

        public async Task<bool> CreateNewChatAsync(string chatName, int chatTypeId, int userCreatorId)
        {
            int createdChatId = await _chatRepository.CreateNewChatAsync(chatName, chatTypeId);
            var subscribeSuccess = await _chatRepository.SubscribeUserToChatAsync(createdChatId, userCreatorId, 1);
            return subscribeSuccess;
        }

        public async Task InviteMembersToChatAsync(int chatId, IEnumerable<int> usersIds)
        {
            foreach (int userId in usersIds)
            {
                ChatMember member = await _userRepository.GetChatMemberAsync(chatId, userId);
                if(member == null)
                {
                    await _chatRepository.SubscribeUserToChatAsync(chatId, userId);
                }
                else if(member.MemberStatusId == 2)
                {
                    await _chatRepository.ChangeMemberStatusInChatAsync(chatId, userId, 1);
                }
            }
        }
    }
}
