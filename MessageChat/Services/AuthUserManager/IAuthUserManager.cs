using System.Collections.Generic;

namespace MessageChat.Services.AuthUserManager
{
    interface IAuthUserManager
    {
        public void AddUser(string name, string userIdentifier, string connectionId);
        public void RemoveUser(string userIdentifier, string userConnectionId);
        public List<string> GetAllAuthUsers();
    }
}
