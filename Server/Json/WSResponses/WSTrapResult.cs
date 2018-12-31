using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Json.WSResponses
{
    [JsonObject]
    public class WSTrapResult
    {
        [JsonProperty("result")]
        public bool result { get; set; }

        public WSTrapResult(bool result)
        {
            this.result = result;
        }
    }
}
