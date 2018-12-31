using ProjectAstolfo.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server
{
    interface DBConnectionManager
    {
        int RegisterUser(string username, string email, string password);

        TokenResponse CheckUser(string email, string password);

        bool CheckUsername(string username);

        bool CheckEmail(string email);

    }
}
