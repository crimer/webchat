using ApplicationCore.Interfaces;
using MessageChat.ApiHelpers;
using MessageChat.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections;
using System.Collections.Generic;
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

        [HttpGet("getChatMessagesById/{chatId}")]
        public async Task<object> GetChatMessages(int chatId)
        {
            var messages = await _chatRepository.GetChatMessagesById(chatId);
            var data = messages.Select(message => new SendMessageDto()
            {
                Id = message.Id,
                Text = message.Text,
                CreatedAt = message.CreatedAt,
                UserName = message.AuthorLogin,
                IsMy = false,
                IsPinned = message.IsPinned
            });
            return new ApiResponse<IEnumerable<SendMessageDto>>(data, (int)HttpStatusCode.OK);
        }

        [HttpGet("getPinnedMessagesByChatId/{chatId}")]
        public async Task<object> GetPinnedMessagesByChatId(int chatId)
        {
            var messages = await _chatRepository.GetPinnedMessagesByChatId(chatId);
            var data = messages.Select(message => new SendMessageDto()
            {
                Id = message.Id,
                Text = message.Text,
                CreatedAt = message.CreatedAt,
                UserName = message.AuthorLogin,
                IsMy = false,
                IsPinned = message.IsPinned
            });
            return new ApiResponse<IEnumerable<SendMessageDto>>(data, (int)HttpStatusCode.OK);
        }
    }
}
