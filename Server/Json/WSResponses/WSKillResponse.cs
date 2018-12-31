using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Json
{
    [JsonObject]
    public class WSKillResponse
    {
        [JsonProperty("nickname")]
        public string nickname { get; set; }

        public WSKillResponse(string nickname)
        {
            this.nickname = nickname;
        }
    }
}
