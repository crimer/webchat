using MessageChat.ApiHelpers;
using Microsoft.AspNetCore.Http;
using System;
using System.Net;
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
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExeptionAsync(ex, context);
            }
        }

        private Task HandleExeptionAsync(Exception error, HttpContext context)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            return context.Response.WriteAsync(new ApiResponse(context.Response.StatusCode, error.Message).ToJson());
        }
    }
}
