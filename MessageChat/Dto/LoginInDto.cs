using System.Runtime.Serialization;

namespace MessageChat.Dto
{
    /// <summary>
    /// Данные для авторизации
    /// </summary>
    [DataContract]
    public class LoginInDto
    {
        /// <summary>
        /// Имя пользователя
        /// </summary>
        [DataMember(Name = "name")]
        public string Name { get; set; }
    }
}