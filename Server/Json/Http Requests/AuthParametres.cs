using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectAstolfo.Json
{
    [JsonObject]
    public class AuthParameters
    {
        [JsonProperty("email")]
        public string email { get; set; }

        [JsonProperty("password")]
        public string password { get; set; }

        public AuthParameters(string email, string password)
        {
            this.email = email;
            this.password = password;
        }
    }

    [JsonObject]
    public class Auth
    {
        [JsonProperty("auth")]
        public AuthParameters authParam { get; set; }

        public Auth(AuthParameters authParameters)
        {
            this.authParam = authParameters;
        }
    }
}
