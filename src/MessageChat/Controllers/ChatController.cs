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
    [Route("chat")]
    [Authorize]
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
            if(userId <= 0) return new ApiResponse((int)HttpStatusCode.BadRequest, "Невохможно получить чаты такого пользователя");

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
    }
}
