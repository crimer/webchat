using System.Runtime.Serialization;

namespace MessageChat.Dto
{
    /// <summary>
    /// Данные для авторизации
    /// </summary>
    [DataContract]
    public class UserLoginDto
    {
        [DataMember(Name = "login")]
        public string Login { get; set; }

        [DataMember(Name = "password")]
        public string Password { get; set; }
    }
}