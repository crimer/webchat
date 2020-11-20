using ApplicationCore.Entities;
using System.Threading.Tasks;

namespace ApplicationCore.Interfaces
{
    public interface IAuthService
    {
        public Task<User> Login(string login, string password);
        public Task<bool> Register(string login, string password);
    }
}
