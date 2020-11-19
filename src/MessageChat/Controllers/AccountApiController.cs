using System;
using System.Security.Claims;
using System.Threading.Tasks;
using MessageChat.Dto;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MessageChat.ApiHelpers;
using System.Net;
using ApplicationCore.Interfaces;
using ApplicationCore.Entities;

namespace MessageChat.Controllers
{
    [Route("account")]
    public class AccountApiController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        public AccountApiController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpPost("login")]
        public async Task<object> Login([FromBody] UserLoginDto loginData)
        {
            if (string.IsNullOrWhiteSpace(loginData.Name) || loginData.Name.Length > 25)
                return new ApiResponse((int)HttpStatusCode.BadRequest, $"Логин не должен быть пустым");

            User dbUser = await _userRepository.GetUserByLogin(loginData.Name);

            if(dbUser == null)
                return new ApiResponse((int)HttpStatusCode.NotFound, $"Не существует пользователя с логином: {loginData.Name}");

            var claims = new []
            {
                new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, dbUser.Login), 
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity), new AuthenticationProperties
            {
                IsPersistent = true,
                AllowRefresh = true,
                ExpiresUtc = DateTime.UtcNow.AddMinutes(3)
            });

            return new ApiResponse<object>(new { id = dbUser.Id, login = dbUser.Login }, (int)HttpStatusCode.OK);
        }

        [HttpPost("register")]
        public async Task<object> Register([FromBody] UserRegisterDto userRegisterDto)
        {
            if (string.IsNullOrWhiteSpace(userRegisterDto.Login) || userRegisterDto.Login.Length > 25 || string.IsNullOrWhiteSpace(userRegisterDto.Password))
                return new ApiResponse((int)HttpStatusCode.BadRequest, $"Логин не должен быть пустым");

            User dbUser = await _userRepository.GetUserByLogin(userRegisterDto.Login);
            
            if(dbUser != null)
                return new ApiResponse((int)HttpStatusCode.BadRequest, $"Уже существует пользователь с логином {userRegisterDto.Login}");

            var registerSuccess = await _userRepository.CreateNewUser(userRegisterDto.Login, userRegisterDto.Password, null);
            return Ok();
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            return new EmptyResult();
        }
    }
}