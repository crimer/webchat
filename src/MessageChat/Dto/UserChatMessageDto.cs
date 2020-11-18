using System;

namespace MessageChat.Dto
{
    public class UserChatMessageDto
    {
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UserName { get; set; }
        public bool IsMy { get; set; }
    }
}