using Newtonsoft.Json;
using ProjectAstolfo.Model.Game;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Json
{
    [JsonObject]
    public class WSShowTrapResponse
    {
        [JsonProperty("xpos")]
        public int xpos { get; set; }

        [JsonProperty("ypos")]
        public int ypos { get; set; }

        [JsonProperty("trap")]
        public string trap { get; set; }

        public WSShowTrapResponse(int xpos, int ypos, string trap)
        {
            this.trap = trap.ToString();
            this.ypos = ypos;
            this.xpos = xpos;
        }
    }
}
