using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Json
{
    [JsonObject]
    public class WSStatusRequest
    {
        [JsonProperty("status")]
        public bool status { get; set; }

        public WSStatusRequest(bool status)
        {
            this.status = status;
        }
    }
}
