using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Text;

namespace Server
{
    public static class Hash
    {
        public static string HashId(int id)
        {
            char[] toCode = id.ToString().ToCharArray();
            return Md5(toCode);
        }

        public static string HashId(string id)
        {
            char[] toCode = id.ToCharArray();
            return Md5(toCode);
        }

        private static string Md5(char[] toCode)
        {
            MD5 md5Hasher = MD5.Create();

            byte[] data = md5Hasher.ComputeHash(Encoding.Default.GetBytes(toCode));

            StringBuilder sBuilder = new StringBuilder();

            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }
            return sBuilder.ToString();
        }
    }
}
