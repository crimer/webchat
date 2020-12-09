using ApplicationCore.Entities;
using ApplicationCore.Helpers;
using ApplicationCore.Interfaces;
using ApplicationCore.Services;
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

        [HttpPost("changeUserPassword")]
        public async Task<ApiResponse> ChangeUserPassword([FromBody] ChangeUserPasswordDto changeUserPasswordDto)
        {
            if (changeUserPasswordDto == null) return new ApiResponse((int)HttpStatusCode.BadRequest);
            if (string.IsNullOrWhiteSpace(changeUserPasswordDto.UserNewPassword) ||
                string.IsNullOrWhiteSpace(changeUserPasswordDto.UserOldPassword) ||
                string.IsNullOrWhiteSpace(changeUserPasswordDto.UserLogin) ||
                changeUserPasswordDto.UserOldPassword == changeUserPasswordDto.UserNewPassword)
            {
                return new ApiResponse((int)HttpStatusCode.BadRequest, "Не валидные данные");
            }

            string oldHashPassword = CryptHelper.Crypt(changeUserPasswordDto.UserOldPassword);
            string newHashPassword = CryptHelper.Crypt(changeUserPasswordDto.UserNewPassword);

            User user = await _userRepository.GetUserAsync(changeUserPasswordDto.UserLogin, oldHashPassword);
            if(user == null) return new ApiResponse((int)HttpStatusCode.BadRequest, "Такого пользователя не существует");

            bool isSuccessChange = await _userRepository.ChangeUserPasswordAsync(user.Id, newHashPassword);
            
            if(isSuccessChange) return new ApiResponse((int)HttpStatusCode.OK);
            else return new ApiResponse((int)HttpStatusCode.BadRequest, "Не удалось изменить пароль");
        }
    }
}
