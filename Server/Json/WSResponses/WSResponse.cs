using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectAstolfo
{
    [JsonObject]
    public class WSResponse
    {
        [JsonProperty("error")]
        public string error { get; set; }

        [JsonProperty("type")]
        public string type { get; set; }

        [JsonProperty("payload")]
        public object payload { get; set; }

        public WSResponse(string error, string type, object payload)
        {
            this.error = error;
            this.type = type;
            this.payload = payload;
        }
    }
}
