using System.Collections.Generic;

namespace MessageChat.Dto.Chat
{
    public class InviteUsersDto
    {
        public int ChatId { get; set; }
        public IEnumerable<int> UserIds { get; set; }
    }
}
