namespace MessageChat.Dto.Chat
{
    public class ChangeChatNameDto
    {
        public int UserId { get; set; }
        public int ChatId { get; set; }
        public string NewName { get; set; }
    }
}
