using ApplicationCore.Entities;
using ApplicationCore.Interfaces;
using System;
using System.Security.Cryptography;
using System.Text;
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
        public static string Crypt(string sourceData)
        {
            string res = string.Empty;
            byte[] tmpSource = ASCIIEncoding.ASCII.GetBytes(sourceData);
            byte[] tmpHash = new MD5CryptoServiceProvider().ComputeHash(tmpSource);
            res = BitConverter.ToString(tmpHash);
            return res;
        }
        public async Task<User> Login(string login, string password)
        {
            string hashPassword = Crypt(password);
            User dbUser = await _userRepository.GetUser(login, hashPassword);
            return dbUser;
        }

        public async Task<bool> Register(string login, string password)
        {
            string hashPassword = Crypt(password);
            User dbUser = await _userRepository.GetUser(login, hashPassword);
            if(dbUser != null)
                return false;

            bool isRegistred = await _userRepository.CreateNewUser(login, hashPassword, null);
            return isRegistred;
        }
    }
}
