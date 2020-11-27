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
        public ChatController(IChatRepository chatRepository, IChatService chatService)
        {
            _chatRepository = chatRepository;
            _chatService = chatService;
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
                Name = chat.Name
                //MediaId = chat.MediaId,
                //MediaPath = chat.MediaPath,
            });
            return new ApiResponse<IEnumerable<UserChatDto>>(data, (int)HttpStatusCode.OK);
        }

        [HttpGet("detailChatInfo/{chatId}")]
        public async Task<object> GetDetailChatInfo(int chatId)
        {
            if (chatId <= 0) return new ApiResponse((int)HttpStatusCode.BadRequest, "Невозможно получить информацию о чате");

            Chat chatDetail = await _chatRepository.GetChat(chatId);
            IEnumerable<User> members = await _chatRepository.GetChatMembers(chatId);
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

            bool creationSuccess = await _chatService.CreateNewChat(createChatDto.ChatName, createChatDto.ChatTypeId,
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

            await _chatService.InviteMembersToChat(inviteUsersDto.ChatId, inviteUsersDto.UserIds);

            return new ApiResponse((int)HttpStatusCode.OK, successMessage: "Все успешно приглашены");
        }
    }
}
