using ApplicationCore.Interfaces;
using MessageChat.ApiHelpers;
using MessageChat.Dto.Chat;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace MessageChat.Controllers
{
    [Authorize]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        [HttpGet("searchUsersByLogin/{userLogin}")]
        public async Task<object> SearchUsersByLogin(string userLogin)
        {
            if (string.IsNullOrWhiteSpace(userLogin)) return new ApiResponse((int)HttpStatusCode.BadRequest, "Пустое имя пользователя");
            var users = await _userRepository.SearchUsersByLogin(userLogin);
            var userDtos = users.Select(user => new UserChatDto()
            {
                Id = user.Id,
                Name = user.Login
            });
            return new ApiResponse<IEnumerable<UserChatDto>>(userDtos, (int)HttpStatusCode.OK);
        }
    }
}
