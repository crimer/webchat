using System.Collections.Generic;

namespace MessageChat.Models
{
    public class User
    {
        public string Name { get; private set; }
        public List<string> Connections { get; set; }
        public User(string name)
        {
            Name = name;
            Connections = new List<string>();
        }
        public void AddNewConnection(string connectionId)
        {
            Connections.Add(connectionId);
        }
        public void RemoveConnection(string connectionId)
        {
            Connections.Remove(connectionId);
        }
    }
}
