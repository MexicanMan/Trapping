using Server;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectAstolfo.Json
{
    [JsonObject]
    public class LobbyResponse
    {
        public LobbyResponse(int id, string name, int playersCount, string status)
        {
            this.id = id;
            this.name = name;
            this.playersCount = playersCount;
            this.status = status;
        }

        public LobbyResponse(Lobby lobby)
        {
            this.id = lobby.Id;
            this.name = lobby.Name;
            this.playersCount = lobby.PlayersNumber;
            this.status = lobby.Status.ToString();
        }
        [JsonProperty("ID")]
        public int id { get; set; }
        [JsonProperty("Name")]
        public string name { get; set; }
        [JsonProperty("Players")]
        public int playersCount { get; set; }
        [JsonProperty("Status")]
        public string status { get; set; }
    }

    [JsonObject]
    public class LobbiesResponse
    {
        public LobbiesResponse(List<LobbyResponse> lobbyResponses)
        {
            this.lobbyResponses = lobbyResponses;
        }
        [JsonProperty("lobbies")]
        public List<LobbyResponse> lobbyResponses { get; set; }
    }
}
