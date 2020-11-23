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
        public ChatController(IChatRepository chatRepository)
        {
            _chatRepository = chatRepository;
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
    }
}
