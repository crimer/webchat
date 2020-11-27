using ApplicationCore.Entities;
using System.Threading.Tasks;

namespace ApplicationCore.Interfaces
{
    public interface IAuthService
    {
        Task<User> Login(string login, string password);
        Task<bool> Register(string login, string password);
    }
}
