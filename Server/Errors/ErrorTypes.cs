using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Errors
{
    public enum ErrorTypes
    {
        AUTH_ERROR,
        ALREADY_REG_EMAIL_ERROR,
        ALREADY_REG_NAME_ERROR,

        UNAUTH_USER_ERROR,

        NONEXIST_LOBBY_ERROR,
        ALREADY_CONNECT_TO_LOBBY_ERROR,
        ALREADY_CONNECT_TO_DIFF_LOBBY_ERROR,
        FULL_LOBBY_ERROR,
    }
}
