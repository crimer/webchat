﻿using System;
using System.Security.Claims;
using System.Threading.Tasks;
using MessageChat.Dto;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MessageChat.ApiHelpers;
using System.Net;

namespace MessageChat.Controllers
{
    [Route("account")]
    public class AccountApiController : ControllerBase
    {
        [HttpPost("login")]
        public async Task<object> Login([FromBody] LoginInDto loginData)
        {
            if (string.IsNullOrWhiteSpace(loginData.Name) || loginData.Name.Length > 25)
                return BadRequest(new
                {
                    name = "Имя не валидно"
                });

            var claims = new []
            {
                new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, loginData.Name), 
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity), new AuthenticationProperties
            {
                IsPersistent = true,
                AllowRefresh = true,
                ExpiresUtc = DateTime.UtcNow.AddMinutes(3)
            });

            return new ApiResponse<object>(new { name = loginData.Name }, (int)HttpStatusCode.OK);
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