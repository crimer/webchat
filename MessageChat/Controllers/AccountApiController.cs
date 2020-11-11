using System;
using System.Security.Claims;
using System.Threading.Tasks;
using MessageChat.Dto;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace MessageChat.Controllers
{
    [Route("account")]
    public class AccountApiController : ControllerBase
    {
        [HttpPost("login")]
        public async Task<object> Login([FromBody] LoginInDto loginData)
        {
            // объявляем роли
            var claims = new []
            {
                new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, loginData.Name), 
            };
            // создаем идентификацию
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            // сохраняем в куки пользователя
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity), new AuthenticationProperties
            {
                IsPersistent = true,
                AllowRefresh = true,
                ExpiresUtc = DateTime.UtcNow.Add(TimeSpan.FromMinutes(1))
            });
            // возврящвем имя авторизированного пользоватеял
            return new
            {
                name = loginData.Name
            };
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