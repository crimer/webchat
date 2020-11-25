using System;

namespace MessageChat.Dto
{
    public class SendMessageDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UserName { get; set; }
        public bool IsMy { get; set; }
        public bool IsPinned { get; set; }
    }
}