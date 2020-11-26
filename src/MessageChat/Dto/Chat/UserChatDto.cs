using ApplicationCore.Entities;

namespace MessageChat.Dto.Chat
{
    public class UserChatDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ChatType ChatType { get; set; }
        public int MediaId { get; set; }
        public int UserRoleId { get; set; }
        public string MediaPath { get; set; }
    }
}
