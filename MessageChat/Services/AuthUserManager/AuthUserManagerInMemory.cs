using MessageChat.Models;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace MessageChat.Services.AuthUserManager
{
    public class AuthUserManagerInMemory : IAuthUserManager
    {
        public ConcurrentDictionary<string, User> _authUsers { get; set; }
        public AuthUserManagerInMemory()
        {
            _authUsers = new ConcurrentDictionary<string, User>();
        }

        public void ConnectedConnection(string name, string userIdentifier, string connectionId)
        {
            if (!_authUsers.ContainsKey(userIdentifier))
            {
                User newUser = new User(name);
                newUser.AddNewConnection(connectionId);

                _authUsers.TryAdd(userIdentifier, newUser);
            }
            else
            {
                User user;
                _authUsers.TryGetValue(userIdentifier, out user);
                user.AddNewConnection(connectionId);
            }
        }

        public void DisconnectedConnection(string userIdentifier, string userConnectionId)
        {
            User deletedUser;
            User user;

            if (!_authUsers.ContainsKey(userIdentifier)) return;

            _authUsers.TryGetValue(userIdentifier, out user);

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
