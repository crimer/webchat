using ApplicationCore.Entities;

namespace MessageChat.Dto.Chat
{
    public class ChatDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ChatType ChatType { get; set; }
    }
}
