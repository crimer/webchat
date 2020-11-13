using MessageChat.Dto;
using MessageChat.Services.AuthUserManager;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MessageChat.SignalR
{
    [Authorize]
    public class MessageHub : Hub
    {
        private readonly IAuthUserManager _authUserManager;
        public MessageHub(IAuthUserManager authUserManager) : base()
        {
            _authUserManager = authUserManager;
        }
        public async Task NewMessage(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return;

            var currentUserName = Context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value ?? "Неизвестный чувак";
            var userChatMessage = new UserChatMessageDto
            {
                Text = text,
                IsMy = false,
                UserName = currentUserName,
            };
            
            var allAuthUsers = _authUserManager.GetAllAuthUsers();
            await Clients.Users(allAuthUsers).SendAsync("NewMessage", userChatMessage);
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

        public override Task OnDisconnectedAsync(System.Exception exception)
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