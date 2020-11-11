using MessageChat.Models;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace MessageChat.Services.AuthUserManager
{
    /// <summary>
    /// Сингелтон для работы с авторизированными пользователями
    /// </summary>
    public class AuthUserManagerInMemory : IAuthUserManager
    {
        private static AuthUserManagerInMemory Manager;

        public ConcurrentDictionary<string, User> _authUsers { get; set; }
        public AuthUserManagerInMemory()
        {
            _authUsers = new ConcurrentDictionary<string, User>();
        }

        public static AuthUserManagerInMemory GetInstance()
        {
            if (Manager == null)
                Manager = new AuthUserManagerInMemory();
            return Manager;
        }

        public void AddUser(string name, string userIdentifier, string connectionId)
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

        public void RemoveUser(string userIdentifier, string userConnectionId)
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

        public List<string> GetAllAuthUsers()
        {
            List<string> allAuthUsers = new List<string>();

            allAuthUsers.AddRange(_authUsers.Keys);
            return allAuthUsers;
        }
    }
}
