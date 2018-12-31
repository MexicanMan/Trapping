using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectAstolfo.Json
{
    [JsonObject]
    public class LobbyRequest
    {
        [JsonProperty("token")]
        public string token { get; set; }

        public LobbyRequest(string token)
        {
            this.token = token;
        }
    }
}
