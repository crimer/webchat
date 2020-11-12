using System.Runtime.Serialization;

namespace MessageChat.Dto
{
    public class UserChatMessageDto
    {
        public string UserName { get; set; }
        public bool IsMy { get; set; }
        public string Text { get; set; }
    }
}