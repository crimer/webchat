using System;

namespace ApplicationCore.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; }
        public int ChatId { get; set; }
        public int MediaId { get; set; }
        public int ReplyId { get; set; }
    }
}
