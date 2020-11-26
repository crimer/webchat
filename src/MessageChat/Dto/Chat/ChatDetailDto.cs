using System.Collections.Generic;

namespace MessageChat.Dto.Chat
{
    public class ChatDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<UserChatDto> Members { get; set; }

    }
}
