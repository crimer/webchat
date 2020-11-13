using System.Collections.Generic;

namespace MessageChat.Services.AuthUserManager
{
    public interface IAuthUserManager
    {
        public void ConnectedConnection(string name, string userIdentifier, string connectionId);
        public void DisconnectedConnection(string userIdentifier, string userConnectionId);
        public IReadOnlyList<string> GetAllAuthUsers();
    }
}
