using ApplicationCore.Interfaces;
using MessageChat.ApiHelpers;
using MessageChat.Dto.Chat;
using MessageChat.Dto.User;
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
        public async Task<ApiResponse> SearchUsersByLogin(string userLogin)
        {
            if (string.IsNullOrWhiteSpace(userLogin)) return new ApiResponse((int)HttpStatusCode.BadRequest, "Пустое имя пользователя");
            var users = await _userRepository.SearchUsersByLoginAsync(userLogin);
            var userDtos = users.Select(user => new UserChatDto()
            {
                Id = user.Id,
                Name = user.Login
            });
            return new ApiResponse<IEnumerable<UserChatDto>>(userDtos, (int)HttpStatusCode.OK);
        }

        [HttpGet("getUserProfile/{userId}")]
        public async Task<ApiResponse> GetUserProfile(int userId)
        {
            if (userId <= 0) return new ApiResponse((int)HttpStatusCode.BadRequest);
            
            var userModel = await _userRepository.GetUserByIdAsync(userId);

            if (userModel == null) return new ApiResponse((int)HttpStatusCode.NotFound);
            UserProfileDto userProfile = new UserProfileDto()
            {
                Id = userModel.Id,
                Login = userModel.Login,
                Password = userModel.Password
            };

            return new ApiResponse<UserProfileDto>(userProfile, (int)HttpStatusCode.OK);
        }
    }
}
