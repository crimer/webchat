namespace ApplicationCore.Entities
{
    public enum ChatType
    {
        Group = 1,
        Channel = 2,
        Direct = 3,
    }
    public class Chat : BaseEntity
    {
        public string Name { get; set; }
        public ChatType ChatType { get; set; }
    }
}
