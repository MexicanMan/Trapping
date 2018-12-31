using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectAstolfo.Json
{
    [JsonObject]
    public class RegisterParametres
    {
        [JsonProperty("nickname")]
        public string username { get; set; }

        [JsonProperty("email")]
        public string email { get; set; }

        [JsonProperty("password")]
        public string password { get; set; }

        public RegisterParametres(string username, string email, string password)
        {
            this.username = username;
            this.email = email;
            this.password = password;
        } 
    }

    [JsonObject]
    public class Register
    {
        [JsonProperty("reg")]
        public RegisterParametres registerParam { get; set; }

        public Register(RegisterParametres registerParametres)
        {
            this.registerParam = registerParametres;
        }
    }
}
