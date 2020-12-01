

namespace ApplicationCore.Entities
{
    public class ChatMember : User
    {
        public int UserRoleId { get; set; }
        public int MemberStatusId { get; set; }

    }
}
