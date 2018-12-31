using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Json
{
    [JsonObject]
    public class WSDirectionRequest
    {
        [JsonProperty("direction")]
        public string direction { get; set; }

        public WSDirectionRequest(string direction)
        {
            this.direction = direction;
        }
    }

    [JsonObject]
    public class WSPlaceTrapRequest
    {
        [JsonProperty("xpos")]
        public int xpos { get; set; }

        [JsonProperty("ypos")]
        public int ypos { get; set; }

        [JsonProperty("trap")]
        public string trap { get; set; }

        public WSPlaceTrapRequest(int xpos, int ypos, string trap)
        {
            this.trap = trap;
            this.ypos = ypos;
            this.xpos = xpos;
        }
    }
}
