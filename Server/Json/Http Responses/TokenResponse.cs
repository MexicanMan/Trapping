using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectAstolfo.Json
{
    [JsonObject]
    public class TokenResponse
    {
        public TokenResponse(string token, string nickname)
        {
            this.token = token;
            this.nickname = nickname;
        }
        [JsonProperty("token")]
        public string token { get; set; }
        [JsonProperty("nickname")]
        public string nickname { get; set; }
    }
}
