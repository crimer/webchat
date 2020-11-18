using ApplicationCore.Interfaces;
using MessageChat.ApiHelpers;
using MessageChat.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace MessageChat.Controllers
{
    [Route("message")]
    [Authorize]
    public class MessageController : ControllerBase
    {
        private readonly IChatRepository _chatRepository;
        public MessageController(IChatRepository chatRepository)
        {
            _chatRepository = chatRepository;
        }

        //[HttpGet("GetChatMessages")]
        //public async Task<object> GetChatMessages(int chatId)
        //{
        //    var messages = await _chatRepository.GetChatMessagesById(chatId);
        //    var data = messages.Select(message => new UserChatMessageDto() 
        //    { 
        //        Text = message.Text,
        //        CreatedAt = message.CreatedAt,
        //        UserName = message.
        //    })
        //    return new ApiResponse(, (int)HttpStatusCode.OK);
        //}
    }
}
