using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Json
{
    [JsonObject]
    public class WSMoveResponse
    {
        [JsonProperty("nickname")]
        public string nickname { get; set; }

        [JsonProperty("direction")]
        public string direction { get; set; }

        public WSMoveResponse(string direction, string nickname)
        {
            this.direction = direction;
            this.nickname = nickname;
        }
    }
}
