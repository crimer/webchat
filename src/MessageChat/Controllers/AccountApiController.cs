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
        private readonly IAuthService _authService;
        public AccountApiController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<object> Login([FromBody] UserLoginDto loginData)
        {
            if (string.IsNullOrWhiteSpace(loginData.Login) || loginData.Login.Length > 25)
                return new ApiResponse((int)HttpStatusCode.BadRequest, $"Логин не должен быть пустым");

            User user = await _authService.Login(loginData.Login, loginData.Password);

            if(user == null)
                return new ApiResponse((int)HttpStatusCode.NotFound, $"Не существует пользователя с таким логином и паролем");

            var claims = new []
            {
                new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, user.Login),
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity), new AuthenticationProperties
            {
                IsPersistent = true,
                AllowRefresh = true,
                ExpiresUtc = DateTime.UtcNow.AddMinutes(3)
            });

            return new ApiResponse<object>(new { id = user.Id, login = user.Login }, (int)HttpStatusCode.OK);
        }

        [HttpPost("register")]
        public async Task<object> Register([FromBody] UserRegisterDto userRegisterDto)
        {
            if (string.IsNullOrWhiteSpace(userRegisterDto.Login) || userRegisterDto.Login.Length > 25 || string.IsNullOrWhiteSpace(userRegisterDto.Password))
                return new ApiResponse((int)HttpStatusCode.BadRequest, $"Логин или пароль не должен быть пустым");

            var isRegistred = await _authService.Register(userRegisterDto.Login, userRegisterDto.Password);
            
            if(!isRegistred)
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