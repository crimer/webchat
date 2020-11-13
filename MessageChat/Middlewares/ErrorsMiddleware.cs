using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace MessageChat.Middlewares
{
    public class ErrorsMiddleware
    {
        private readonly RequestDelegate _next;
        public ErrorsMiddleware(RequestDelegate next)
        {
            _next = next;
        }
        public async Task InvokeAsync(HttpContext context)
        {
        }
    }
}
