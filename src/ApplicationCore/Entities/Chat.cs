namespace ApplicationCore.Entities
{
    public enum ChatType
    {
        Group,
        Channel,
        Direct
    }
    public class Chat
    {
        public string Name { get; set; }
        public ChatType ChatType { get; set; }
    }
}
