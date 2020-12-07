using ApplicationCore.Entities;
using System.Threading.Tasks;

namespace ApplicationCore.Interfaces
{
    public interface IAuthService
    {
        Task<User> LoginAsync(string login, string password);
        Task<bool> RegisterAsync(string login, string password);
    }
}
