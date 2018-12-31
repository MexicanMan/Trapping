using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectAstolfo
{
    [JsonObject]
    public class WSRequest
    {
        [JsonProperty("token")]
        public string token { get; set; }

        [JsonProperty("type")]
        public string type { get; set; }

        [JsonProperty("payload")]
        public object payload { get; set; }

        public WSRequest(string token, string type, object payload)
        {
            this.token = token;
            this.type = type;
            this.payload = payload;
        }
    }
}
