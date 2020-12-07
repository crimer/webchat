using ApplicationCore.Entities;
using ApplicationCore.Interfaces;
using MessageChat.ApiHelpers;
using MessageChat.Dto.Chat;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace MessageChat.Controllers
{
    [Authorize]
    [Route("chat")]
    public class ChatController : ControllerBase
    {
        private readonly IChatRepository _chatRepository;
        private readonly IChatService _chatService;
        private readonly IUserRepository _userRepository;
        public ChatController(IChatRepository chatRepository, IChatService chatService, IUserRepository userRepository)
        {
            _chatRepository = chatRepository;
            _chatService = chatService;
            _userRepository = userRepository;
        }

        [HttpGet("getChatsByUserId/{userId}")]
        public async Task<object> GetChatsByUserId(int userId)
        {
            if (userId <= 0) return new ApiResponse((int)HttpStatusCode.BadRequest, "Невозможно получить чаты такого пользователя");

            var userChats = await _chatRepository.GetAllChatsByUserId(userId);
            IEnumerable<UserChatDto> data = userChats.Select(chat => new UserChatDto()
            {
                Id = chat.Id,
                ChatType = chat.ChatType,
                Name = chat.Name,
            });
            return new ApiResponse<IEnumerable<UserChatDto>>(data, (int)HttpStatusCode.OK);
        }

        [HttpGet("getChatsToReturnByUserId/{userId}")]
        public async Task<object> GetChatsToReturnByUserId(int userId)
        {
            if (userId <= 0) return new ApiResponse((int)HttpStatusCode.BadRequest, "Невозможно получить чаты такого пользователя");

            var userChats = await _chatRepository.GetChatsToReturnByUserId(userId);
            IEnumerable<ChatDto> data = userChats.Select(chat => new ChatDto()
            {
                Id = chat.Id,
                ChatType = chat.ChatType,
                Name = chat.Name,
            });
            return new ApiResponse<IEnumerable<ChatDto>>(data, (int)HttpStatusCode.OK);
        }

        [HttpGet("detailChatInfo/{chatId}")]
        public async Task<object> GetDetailChatInfo(int chatId)
        {
            if (chatId <= 0) return new ApiResponse((int)HttpStatusCode.BadRequest, "Невозможно получить информацию о чате");

            Chat chatDetail = await _chatRepository.GetChat(chatId);
            IEnumerable<ChatMember> members = await _chatRepository.GetChatMembers(chatId);
            var chatMembers = members.Select(member => new UserChatDto()
            {
                Id = member.Id,
                Name = member.Login,
                UserRoleId = member.UserRoleId
            });

            ChatDetailDto detailDto = new ChatDetailDto()
            {
                Id = chatDetail.Id,
                Name = chatDetail.Name,
                Members = chatMembers
            };
            return new ApiResponse<ChatDetailDto>(detailDto, (int)HttpStatusCode.OK);
        }

        [HttpPost("createNewChat")]
        public async Task<object> CreateNewChat([FromBody] CreateChatDto createChatDto)
        {
            if (createChatDto == null) return new ApiResponse((int)HttpStatusCode.BadRequest, "Невозможно создать чат");

            bool creationSuccess = await _chatService.CreateNewChatAsync(createChatDto.ChatName, createChatDto.ChatTypeId,
                createChatDto.UserCreatorId, createChatDto.MediaId);

            if (creationSuccess)
                return new ApiResponse((int)HttpStatusCode.OK, null, $"Чат {createChatDto.ChatName} успешно создан");
            else
                return new ApiResponse((int)HttpStatusCode.BadRequest, "Не удалось создать чат");
        }

        [HttpPost("inviteMembersToChat")]
        public async Task<object> InviteMembers([FromBody] InviteUsersDto inviteUsersDto)
        {
            if (inviteUsersDto == null || inviteUsersDto.ChatId <= 0) return new ApiResponse((int)HttpStatusCode.BadRequest, "Что-то пошло не так");
            if (inviteUsersDto.UserIds.Count() == 0) return new ApiResponse((int)HttpStatusCode.BadRequest, "Некого приглашать в чат");

            await _chatService.InviteMembersToChatAsync(inviteUsersDto.ChatId, inviteUsersDto.UserIds);

            return new ApiResponse((int)HttpStatusCode.OK, successMessage: "Пользователь успешно приглашен");
        }
        
        [HttpPost("returnToChat")]
        public async Task<object> ReturnToChat([FromBody] ReturnToChatDto returnToChatDto)
        {
            if (returnToChatDto == null || returnToChatDto.ChatId <= 0 || returnToChatDto.UserId <= 0) return new ApiResponse((int)HttpStatusCode.BadRequest, "Что-то пошло не так");

            bool isSuccessReturn = await _chatService.BackToChatAsync(returnToChatDto.ChatId, returnToChatDto.UserId);
            if(isSuccessReturn)
                return new ApiResponse((int)HttpStatusCode.OK);
            else
                return new ApiResponse((int)HttpStatusCode.BadRequest);
        }

        [HttpPost("changeChatName")]
        public async Task<object> ChangeChatName([FromBody] ChangeChatNameDto changeChatNameDto)
        {
            if (changeChatNameDto == null || changeChatNameDto.ChatId <= 0 || changeChatNameDto.UserId <= 0) return new ApiResponse((int)HttpStatusCode.BadRequest, "Что-то пошло не так");
            if (string.IsNullOrWhiteSpace(changeChatNameDto.NewName)) return new ApiResponse((int)HttpStatusCode.BadRequest, "Новое название не должно быть пустым");

            ChatMember user = await _userRepository.GetChatMember(changeChatNameDto.ChatId, changeChatNameDto.UserId);

            if(user.UserRoleId == 1)
                await _chatService.ChangeChatNameAsync(changeChatNameDto.ChatId, changeChatNameDto.NewName);
            else 
                return new ApiResponse((int)HttpStatusCode.BadRequest, "У вас нет прав изменить название чата");

            return new ApiResponse((int)HttpStatusCode.OK, successMessage: "Все успешно изменили имя чата");
        }
        
        [HttpPost("changeMemberRole")]
        public async Task<object> ChangeMemberRole([FromBody] ChangeUserRoleDto changeUserRoleDto)
        {
            if (changeUserRoleDto == null || changeUserRoleDto.ChatId <= 0 
                || changeUserRoleDto.UserId <= 0 || changeUserRoleDto.UserRoleId <= 0)
                return new ApiResponse((int)HttpStatusCode.BadRequest, "Что-то пошло не так");

            ChatMember user = await _userRepository.GetChatMember(changeUserRoleDto.ChatId, changeUserRoleDto.UserId);

            if(user.UserRoleId == changeUserRoleDto.UserRoleId)
                return new ApiResponse((int)HttpStatusCode.BadRequest, "У этого пользователя и так установлена эта роль");
            else 
                await _chatService.ChangeUserRoleAsync(changeUserRoleDto.ChatId, changeUserRoleDto.UserId, changeUserRoleDto.UserRoleId);

            return new ApiResponse((int)HttpStatusCode.OK, successMessage: "Все успешно изменили роль пользователя");
        }
        
        [HttpPost("leaveChat")]
        public async Task<object> UserLaveChat([FromBody] UserLeaveChatDto userLeaveChatDto)
        {
            if (userLeaveChatDto == null || userLeaveChatDto.ChatId <= 0 || userLeaveChatDto.UserId <= 0)
                return new ApiResponse((int)HttpStatusCode.BadRequest, "Что-то пошло не так");

            await _chatRepository.UserLaveChat(userLeaveChatDto.ChatId, userLeaveChatDto.UserId);

            return new ApiResponse((int)HttpStatusCode.OK, successMessage: "Все успешно изменили роль пользователя");
        }

        [HttpPost("kikUserFromChat")]
        public async Task<object> KikUserFromChat([FromBody] UserLeaveChatDto userLeaveChatDto)
        {
            if (userLeaveChatDto == null || userLeaveChatDto.ChatId <= 0 || userLeaveChatDto.UserId <= 0)
                return new ApiResponse((int)HttpStatusCode.BadRequest, "Что-то пошло не так");

            await _chatRepository.AdminKikUser(userLeaveChatDto.ChatId, userLeaveChatDto.UserId);

            return new ApiResponse((int)HttpStatusCode.OK, successMessage: "Все успешно изменили роль пользователя");
        }
    }
}
