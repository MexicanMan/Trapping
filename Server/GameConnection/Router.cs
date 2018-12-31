using Server;
using Server.Json;
using Newtonsoft.Json;
using ProjectAstolfo.Model;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using WebSocketSharp.Net.WebSockets;

namespace ProjectAstolfo
{
    public static class Router
    {
        private static Dictionary<string, Lobby> LobbyRoutes = new Dictionary<string, Lobby>();

        public static bool ProcessRequest(WebSocketContext wsContext, string token, string type, object data)
        {
            //Тассов, не стукай
            bool isConnected = TokenManager.CheckUser(token) && LobbyRoutes.ContainsKey(token);
            if(!isConnected)
            {
                return false;
            }
            switch(type)
            {
                case("CONNECT"):
                    ConnectPlayer(wsContext, token);
                    break;
                case ("PING"):
                    break;
                case ("PLAYER_STATUS_CHANGED"):
                    WSStatusRequest statusReq = JsonConvert.DeserializeObject<WSStatusRequest>(data.ToString());
                    ChangePlayerStatus(token, statusReq.status);
                    break;
                case ("MOVE_ATTEMPT"):
                    WSDirectionRequest dir = JsonConvert.DeserializeObject<WSDirectionRequest>(data.ToString());
                    MovePlayer(token, dir.direction);
                    break;
                case ("TRAP_PLACE"):
                    WSPlaceTrapRequest req = JsonConvert.DeserializeObject<WSPlaceTrapRequest>(data.ToString());
                    PlaceTrap(token, req.trap, req.xpos, req.ypos);
                    break;
                case ("DISCONNECT"):
                    DisconnectPlayer(token);
                    break;
                default:
                    UnknownCommand();
                    break;
            }
            return true;
        }

        private static void UnknownCommand()
        {
            return;
        }

        private static void AlreadyConnected()
        {
            return;
        }

        private static void ConnectPlayer(WebSocketContext wsContext, string token)
        {
            Player p = TokenManager.GetPlayer(token);
            p.ConnectToLobby(wsContext);
        }

        //Reconnect? No!

        private static void DisconnectPlayer(string token)
        {
            Monitor.Enter(LobbyRoutes);
            Lobby l = LobbyRoutes[token];
            l.DisconnectPlayer(token);
            Monitor.Exit(LobbyRoutes);
        }

        private static void ChangePlayerStatus(string token, bool status)
        {
            Lobby l = LobbyRoutes[token];
            l.ChangePlayerStatus(token, status);
            var playerList = l.GetPlayerList();
            for(int i = 0; i < playerList.Count; i++)
            {
                SendPing(playerList[i].WSContext, token);
            }
            
        }

        private static void MovePlayer(string token, string dir)
        {
            Lobby l = LobbyRoutes[token];
            bool moved = l.MoveCharacter(token, dir);
            string nickname = l.GetPlayer(token).Nickname;
            var playerList = l.GetPlayerList();
            if (moved)
            {
                for (int i = 0; i < playerList.Count; i++)
                {
                    SendMessage(playerList[i].WSContext, "MOVE", new WSMoveResponse(dir, nickname));
                }
            }
        }

        private static void PlaceTrap(string token, string trap, int xpos, int ypos)
        {
            Lobby l = LobbyRoutes[token];
            bool placed = false;
            bool show = l.PlaceTrap(token, trap, xpos, ypos, out placed);
            string nickname = l.GetPlayer(token).Nickname;
            var playerList = l.GetPlayerList();
            if(placed)
            {
                Player p = LobbyRoutes[token].GetPlayer(token);
                SendMessage(p.WSContext, "TRAP_PLACED");
            }
            if (show)
            {
                for (int i = 0; i < playerList.Count; i++)
                {
                    SendMessage(playerList[i].WSContext, "SHOW_TRAP", new WSShowTrapResponse(xpos, ypos, trap));
                }
            }
        }

        public static void SendPing(WebSocketContext wsContext, string token)
        {
            Monitor.Enter(LobbyRoutes);
            if (LobbyRoutes.ContainsKey(token))
            {
                WSPlayersResponse playersResponse = new WSPlayersResponse(LobbyRoutes[token]);
                if (!SendMessage(wsContext, "PING", playersResponse))
                {
                    LobbyRoutes[token].DisconnectPlayer(token);
                }
            }
            Monitor.Exit(LobbyRoutes);
        }

        public static bool SendMessage(WebSocketContext wsContext, string type, object data = null, string err = "")
        {
            WSResponse wsr = new WSResponse(err, type, data);
            string ans = JsonConvert.SerializeObject(wsr);
            try
            {
                wsContext.WebSocket.Send(ans);
            }
            catch(Exception e)
            {
                Console.WriteLine("Can't send message\n"+e.Message);
                return false;
            }
            return true;
        }

        public static void RegisterLobbyRoute(string token, Lobby l)
        {
            if (LobbyRoutes.ContainsKey(token))
            {
                //SendMessage(TokenManager[token])
            }
            else
            {
                LobbyRoutes.Add(token, l);
            }
        }

        public static void UnregisterLobbyRoute(string token)
        {
            if (LobbyRoutes.ContainsKey(token))
            {
                LobbyRoutes.Remove(token);
            }
            else
            {
                throw new Exception("Вы не подосоединены ни к одному лобби");
            }
        }

    }
}
