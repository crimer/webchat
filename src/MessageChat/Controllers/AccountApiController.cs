using ApplicationCore.Entities;
using ApplicationCore.Interfaces;
using MessageChat.ApiHelpers;
using MessageChat.Dto;
using MessageChat.Dto.User;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MessageChat.Controllers
{
    [Route("account")]
    public class AccountApiController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AccountApiController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ApiResponse> Login([FromBody] UserLoginDto loginData)
        {
            if(loginData == null)
                return new ApiResponse((int)HttpStatusCode.BadRequest, $"Что-то пошло не так");

            if (string.IsNullOrWhiteSpace(loginData.Login) || string.IsNullOrWhiteSpace(loginData.Password))
                return new ApiResponse((int)HttpStatusCode.BadRequest, $"Пустые данные");

            User user = await _authService.LoginAsync(loginData.Login, loginData.Password);

            if (user == null)
                return new ApiResponse((int)HttpStatusCode.NotFound, $"Не существует пользователя с таким логином и паролем");

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, user.Login),
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity), new AuthenticationProperties
            {
                IsPersistent = true,
                AllowRefresh = true,
                ExpiresUtc = DateTime.UtcNow.AddHours(24)
            });

            return new ApiResponse<AuthUserDto>(new AuthUserDto() { Id = user.Id, Login = user.Login }, (int)HttpStatusCode.OK);
        }

        [HttpPost("register")]
        public async Task<ApiResponse> Register([FromBody] UserRegisterDto userRegisterDto)
        {
            if(userRegisterDto == null)
                return new ApiResponse((int)HttpStatusCode.BadRequest, $"Что-то пошло не так");

            if (string.IsNullOrWhiteSpace(userRegisterDto.Login) || string.IsNullOrWhiteSpace(userRegisterDto.Password))
                return new ApiResponse((int)HttpStatusCode.BadRequest, $"Логин или пароль не должен быть пустым");

            var isRegistred = await _authService.RegisterAsync(userRegisterDto.Login, userRegisterDto.Password);

            if (!isRegistred)
                return new ApiResponse((int)HttpStatusCode.BadRequest, $"Уже существует пользователь с логином {userRegisterDto.Login}");

            return new ApiResponse((int)HttpStatusCode.OK);
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