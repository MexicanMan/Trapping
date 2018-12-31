using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Json
{
    [JsonObject]
    public class WSRemoveTrap
    {
        [JsonProperty("xpos")]
        public int xpos { get; set; }

        [JsonProperty("ypos")]
        public int ypos { get; set; }

        public WSRemoveTrap(int xpos, int ypos)
        {
            this.ypos = ypos;
            this.xpos = xpos;
        }
    }
}
