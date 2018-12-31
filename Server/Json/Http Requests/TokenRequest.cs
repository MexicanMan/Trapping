using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectAstolfo.Json
{
    [JsonObject]
    public class TokenRequest
    {
        [JsonProperty("token")]
        public string token { get; set; }

        public TokenRequest(string token)
        {
            this.token = token;
        }
    }
}
