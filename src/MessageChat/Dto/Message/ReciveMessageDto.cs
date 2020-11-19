namespace MessageChat.Dto.Message
{
    public class ReciveMessageDto
    {
        public string Text { get; set; }
        public int UserId { get; set; }
        public int ChatId { get; set; }
        public int? ReplyId { get; set; } = null;
        public int? MediaId { get; set; } = null;
    }
}
