using ApplicationCore.Interfaces;
using MessageChat.Dto;
using MessageChat.Dto.Message;
using MessageChat.Models;
using MessageChat.Services.AuthUserManager;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MessageChat.SignalR
{
    [Authorize]
    public class MessageHub : Hub
    {
        private readonly IAuthUserManager _authUserManager;
        private readonly IMessageRepository _messageRepository;
        public MessageHub(IAuthUserManager authUserManager, IMessageRepository messageRepository)
        {
            _authUserManager = authUserManager;
            _messageRepository = messageRepository;
        }

        public async Task NewMessage(ReciveMessageDto reciveMessage)
        {
            if (string.IsNullOrWhiteSpace(reciveMessage.Text)) return;

            var currentUserName = Context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value ?? "Неизвестный чувак";
            try
            {
                var allAuthUsers = _authUserManager.GetAllAuthUsers();
                int newMessageId = await _messageRepository.CreateNewMessageAsync(reciveMessage.Text, reciveMessage.UserId, reciveMessage.ChatId);
                
                var sendMessage = new SendMessageDto
                {
                    Id = newMessageId,
                    Text = reciveMessage.Text,
                    IsMy = false,
                    UserName = currentUserName,
                };

                await Clients.Users(allAuthUsers).SendAsync(WebSocketMessageTypes.NewMessage, sendMessage);
            }
            catch (Exception error)
            {
                Console.WriteLine($"NewMessage Hub error {error.Message}");
            }
        }
       
        public override Task OnConnectedAsync()
        {
            string userName = Context.User.Identity.Name;
            string userIdentifier = Context.UserIdentifier;
            string userConnectionId = Context.ConnectionId;

            if (userName == null || !Context.User.Identity.IsAuthenticated)
                return base.OnConnectedAsync();

            _authUserManager.ConnectedConnection(userName, userIdentifier, userConnectionId);

            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            string userName = Context.User.Identity.Name;
            string userIdentifier = Context.UserIdentifier;
            string userConnectionId = Context.ConnectionId;

            if (userName == null || !Context.User.Identity.IsAuthenticated)
                return base.OnDisconnectedAsync(exception);

            _authUserManager.DisconnectedConnection(userIdentifier, userConnectionId);

            return base.OnDisconnectedAsync(exception);
        }
    }
}