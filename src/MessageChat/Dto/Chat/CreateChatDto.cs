namespace MessageChat.Dto.Chat
{
    public class CreateChatDto
    {
        public int ChatTypeId { get; set; }
        public int UserCreatorId { get; set; }
        public string ChatName { get; set; }
    }
}
