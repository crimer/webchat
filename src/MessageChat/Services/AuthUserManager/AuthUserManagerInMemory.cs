using MessageChat.Models;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace MessageChat.Services.AuthUserManager
{
    public class AuthUserManagerInMemory : IAuthUserManager
    {
        public ConcurrentDictionary<string, AuthUser> _authUsers { get; set; }
        public AuthUserManagerInMemory()
        {
            _authUsers = new ConcurrentDictionary<string, AuthUser>();
        }

        public void ConnectedConnection(string name, string userIdentifier, string connectionId)
        {
            if (!_authUsers.ContainsKey(userIdentifier))
            {
                AuthUser newUser = new AuthUser(name);
                newUser.AddNewConnection(connectionId);

                _authUsers.TryAdd(userIdentifier, newUser);
            }
            else
            {
                AuthUser user;
                _authUsers.TryGetValue(userIdentifier, out user);
                if(user != null)
                    user.AddNewConnection(connectionId);
            }
        }

        public void DisconnectedConnection(string userIdentifier, string userConnectionId)
        {
            AuthUser deletedUser;
            AuthUser user;

            if (!_authUsers.ContainsKey(userIdentifier)) return;

            _authUsers.TryGetValue(userIdentifier, out user);

            if (user == null) return;

            if (user.Connections.Count == 1)
            {
                _authUsers.TryRemove(userIdentifier, out deletedUser);
            }
            else if (user.Connections.Contains(userConnectionId))
            {
                user.RemoveConnection(userConnectionId);
            }
        }
        public IReadOnlyList<string> GetAllAuthUsers() => _authUsers.Keys.ToList();
    }
}
