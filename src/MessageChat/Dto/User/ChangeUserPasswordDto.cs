namespace MessageChat.Dto.User
{
    public class ChangeUserPasswordDto
    {
        public string UserLogin { get; set; }
        public string UserNewPassword { get; set; }
        public string UserOldPassword { get; set; }
    }
}
