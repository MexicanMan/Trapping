using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectAstolfo.Json
{
    [JsonObject]
    public class NewLobbyResponse
    {
        [JsonProperty("id")]
        public int id { get; set; }

        public NewLobbyResponse(int id)
        {
            this.id = id;
        }
    }
}
