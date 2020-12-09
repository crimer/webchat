using System;
using System.Security.Cryptography;
using System.Text;

namespace ApplicationCore.Helpers
{
    public class CryptHelper
    {
        public static string Crypt(string sourceData)
        {
            string res = string.Empty;
            byte[] tmpSource = ASCIIEncoding.ASCII.GetBytes(sourceData);
            byte[] tmpHash = new MD5CryptoServiceProvider().ComputeHash(tmpSource);
            res = BitConverter.ToString(tmpHash);
            return res;
        }
    }
}
