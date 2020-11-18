using System.Runtime.Serialization;

namespace MessageChat.Dto
{
    [DataContract]
    public class UserRegisterDto
    {
        [DataMember(Name = "login")]
        public string Login { get; set; }
        [DataMember(Name = "pasword")]
        public string Password { get; set; }
    }
}
