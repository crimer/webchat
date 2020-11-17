namespace ApplicationCore.Entities
{
    public enum ChatType
    {
        Group,
        Channel,
        Direct
    }
    public class Chat : BaseEntity
    {
        public string Name { get; set; }
        public ChatType ChatType { get; set; }
        public int MediaId { get; set; }
    }
}
