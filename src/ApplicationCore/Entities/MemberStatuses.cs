namespace ApplicationCore.Entities
{
    public class MemberStatuses
    {
        public enum MemberStatus : int
        {
            InChat = 1,
            KikedByAdmin = 3,
            LeaveChat = 2
        }
    }
}
