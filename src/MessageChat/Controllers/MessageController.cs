﻿using ApplicationCore.Interfaces;
using MessageChat.ApiHelpers;
using MessageChat.Dto;
using MessageChat.Dto.Message;
using MessageChat.Dto.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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
        private readonly IUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;
        public MessageController(IChatRepository chatRepository,IUserRepository userRepository, IMessageRepository messageRepository)
        {
            _chatRepository = chatRepository;
            _messageRepository = messageRepository;
            _userRepository = userRepository;
        }

        [HttpGet("getChatMessagesById/{chatId}")]
        public async Task<ApiResponse> GetChatMessages(int chatId)
        {
            var userCookiesJson = HttpContext.Request.Cookies["userData"];
            AuthUserDto userCookiesData = JsonConvert.DeserializeObject<AuthUserDto>(userCookiesJson);
            
            var chatMember = await _userRepository.GetChatMemberAsync(chatId, userCookiesData.Id);
            
            if(chatMember == null)
                return new ApiResponse((int)HttpStatusCode.NotFound);
            
            if(chatMember.MemberStatusId != 1)
                return new ApiResponse((int)HttpStatusCode.NotFound);

            var messages = await _chatRepository.GetChatMessagesByIdAsync(chatId);
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

        [HttpPost("togglePinMessage")]
        public async Task<ApiResponse> TogglePinMessage([FromBody] PinMessageDto pinMessageDto)
        {
            if (pinMessageDto == null) return new ApiResponse((int)HttpStatusCode.BadRequest);
            if (pinMessageDto.MessageId <= 0) return new ApiResponse((int)HttpStatusCode.BadRequest);

            var message = await _messageRepository.GetMessageByIdAsync(pinMessageDto.MessageId);
            if (!message.IsPinned)
            {
                await _messageRepository.PinMessageByIdAsync(pinMessageDto.MessageId, pinMessageDto.IsPin);
                return new ApiResponse((int)HttpStatusCode.OK);
            }
            else
            {
                return new ApiResponse((int)HttpStatusCode.BadRequest,"Сообщение уже закреплено");
            }
        }

        [HttpGet("getPinnedMessagesByChatId/{chatId}")]
        public async Task<object> GetPinnedMessagesByChatId(int chatId)
        {
            var messages = await _chatRepository.GetPinnedMessagesByChatIdAsync(chatId);
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
