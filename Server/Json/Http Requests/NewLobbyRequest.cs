using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectAstolfo.Json
{
    [JsonObject]
    public class NewLobbyRequest
    {
        [JsonProperty("token")]
        public string token { get; set; }

        [JsonProperty("lobbyName")]
        public string lobbyName { get; set; }

        public NewLobbyRequest(string token, string lobbyName)
        {
            this.token = token;
            this.lobbyName = lobbyName;
        }
    }
}
