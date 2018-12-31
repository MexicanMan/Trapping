using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Json
{
    [JsonObject]
    public class WSFinishResponse
    {
        [JsonProperty("nickname")]
        public string nickname { get; set; }

        public WSFinishResponse(string nickname)
        {
            this.nickname = nickname;
        }
    }
}
