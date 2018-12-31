using ProjectAstolfo.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server
{
    public static class Lobbies
    {
        private static List<Lobby> lobbies = new List<Lobby>();
        private static Dictionary<int, Lobby> lobbyIds = new Dictionary<int, Lobby>();

        public static LobbiesResponse getLobbiesResponse()
        {
            //lobbies.Add(new Lobby(1, "SCHWERERPANZERSPÄHWAGENSIEBENKOMMAFÜNFZENTIMETERSONDERKRAFTFAHRZEUGZWEIHUNDERTVIERUNDDREISSIGVIERPANZERABWEHRKANONENWAGEN"));
            List<LobbyResponse> responses = new List<LobbyResponse>();
            for(int i = 0; i < lobbies.Count; i++)
            {
                Lobby l = lobbies[i];
                LobbyResponse lr = new LobbyResponse(l.Id, l.Name, l.PlayersNumber, l.Status.ToString());
                responses.Add(lr);
            }
            LobbiesResponse response = new LobbiesResponse(responses);
            return response;
        }

        
         //* зависит от логики
        public static void AddLobby(Lobby lobby)
        {
            lobbies.Add(lobby);
            lobbyIds.Add(lobby.Id, lobby);
        }

        public static void RemoveLobby(int id)
        {
            Lobby l = lobbyIds[id];
            lobbies.Remove(l);
        }

        public static Lobby GetLobby(int id)
        {
            if(lobbyIds.ContainsKey(id))
            {
                return lobbyIds[id];
            }
            else
            {
                return null;
            }
        }
        
        
    }
}
