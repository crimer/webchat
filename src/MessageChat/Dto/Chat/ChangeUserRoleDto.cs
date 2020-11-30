namespace MessageChat.Dto.Chat
{
    public class ChangeUserRoleDto
    {
        public int UserId { get; set; }
        public int ChatId { get; set; }
        public int UserRoleId { get; set; }
    }
}
