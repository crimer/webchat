using ApplicationCore.Entities;
using ApplicationCore.Helpers;
using ApplicationCore.Interfaces;
using System.Threading.Tasks;

namespace ApplicationCore.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<User> LoginAsync(string login, string password)
        {
            string hashPassword = CryptHelper.Crypt(password);
            User dbUser = await _userRepository.GetUserAsync(login, hashPassword);
            return dbUser;
        }

        public async Task<bool> RegisterAsync(string login, string password)
        {
            string hashPassword = CryptHelper.Crypt(password);
            User dbUser = await _userRepository.GetUserAsync(login, hashPassword);
            if (dbUser != null)
                return false;

            bool isRegistred = await _userRepository.CreateNewUserAsync(login, hashPassword);
            return isRegistred;
        }
    }
}
