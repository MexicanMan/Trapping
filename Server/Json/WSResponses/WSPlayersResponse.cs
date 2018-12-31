using Newtonsoft.Json;
using ProjectAstolfo.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Json
{
    [JsonObject]
    public class WSPlayersResponse
    {
        [JsonProperty("players")]
        public List<WSPlayerResponse> playersResponse { get; set; }

        public WSPlayersResponse(List<WSPlayerResponse> playersResponse)
        {
            this.playersResponse = playersResponse;
        }

        public WSPlayersResponse(Lobby lobby)
        {
            List<WSPlayerResponse> responses = new List<WSPlayerResponse>();
            List<Player> pls = lobby.GetPlayerList();
            for(int i = 0; i < pls.Count; i++)
            {
                responses.Add(new WSPlayerResponse(pls[i]));
            }
            this.playersResponse = responses;
        }
    }

    [JsonObject]
    public class WSPlayerResponse
    {
        [JsonProperty("nick")]
        public string name { get; set; }
        [JsonProperty("status")]
        public string status { get; set; }

        public WSPlayerResponse(string name, string status)
        {
            this.name = name;
            this.status = status;
        }

        public WSPlayerResponse(Player pl)
        {
            this.name = pl.Nickname;
            this.status = pl.Status.ToString();
        }
    }

}
