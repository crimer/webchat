using System;
using System.Threading.Tasks;
using ApplicationCore.Interfaces;
using ApplicationCore.Options;
using ApplicationCore.Services;
using Infrastructure.Data;
using Infrastructure.Interfaces;
using MessageChat.Middlewares;
using MessageChat.Services.AuthUserManager;
using MessageChat.SignalR;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Authentication;

namespace MessageChat
{
    public class Startup
    {
        private readonly IConfiguration _configuration;
        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<MessageHub>();
            services.AddControllers();
            services.AddCors();
            services.AddSignalR(options =>
            {
                options.KeepAliveInterval = TimeSpan.FromMinutes(5);
                options.ClientTimeoutInterval = TimeSpan.FromMinutes(5);
            });

            services.AddSingleton<IAuthUserManager, AuthUserManagerInMemory>();
            services.AddSingleton<IDataAccess, AdoDataAccess>();
            services.AddSingleton<IUserRepository, UserRepository>();
            services.AddSingleton<IMessageRepository, MessageRepository>();
            services.AddSingleton<IChatRepository, ChatRepository>();
            services.AddSingleton<IAuthService, AuthService>();
            services.AddSingleton<IChatService, ChatService>();

            services.Configure<DatabaseSettings>(options => _configuration.GetSection("DatabaseSettings").Bind(options));

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.Cookie.SameSite = SameSiteMode.None;
                });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseMiddleware<ErrorsMiddleware>();

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();
            
            app.UseCors(builder =>
            {
                builder
                    .AllowAnyHeader()
                    .AllowCredentials()
                    .AllowAnyMethod()
                    .WithOrigins("http://localhost:3000")
                    .WithOrigins("http://localhost:80");
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<MessageHub>("/lothub");
            });
        }
    }
}