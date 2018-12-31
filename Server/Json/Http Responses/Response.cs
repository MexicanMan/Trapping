using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectAstolfo.Json
{
    [JsonObject]
    public class Response
    {
        public Response(string error, object payload)
        {
            this.error = error;
            this.payload = payload;
        }
        [JsonProperty("error")]
        public string error { get; set; }
        [JsonProperty("payload")]
        public object payload { get; set; }
    }

}
