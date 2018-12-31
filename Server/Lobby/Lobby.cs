using Server.Json;
using Server.Model.Util;
using ProjectAstolfo;
using ProjectAstolfo.Model;
using ProjectAstolfo.Model.Game;
using ProjectAstolfo.Model.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebSocketSharp.Net.WebSockets;

namespace Server
{
    public enum LobbyStatus
    {
        WaitingForPlayer,
        Full,
        Started,
        StartedRun
    }

    public class Lobby : INotifier
    {
        private static int max_Id = 1;
        private LobbyStatus status;
        private int id;
        private string name;
        private Dictionary<string, Player> players = new Dictionary<string, Player>();
        private GameManager GM;

        private static TimeSpan ConnectTime = TimeSpan.FromSeconds(5);
        Timer t;

        private static TimeSpan StartTime = TimeSpan.FromSeconds(4);
        private static TimeSpan PrepareTime = TimeSpan.FromSeconds(30);
        Timer StartCount;

        public int PlayersNumber
        {
            get
            {
                return players.Count;
            }
        }

        public LobbyStatus Status
        {
            get
            {
                return status;
            }
        }

        public int Id
        {
            get
            {
                return id;
            }
        }

        public string Name
        {
            get
            {
                return name;
            }
        }

        public Lobby(string name)
        {
            this.id = max_Id;
            max_Id++;
            this.name = name;
        }

        public void ConnectPlayer(Player pl)
        {
            if(!players.ContainsKey(pl.PlayerToken))
            {
                players.Add(pl.PlayerToken, pl);
                Router.RegisterLobbyRoute(pl.PlayerToken, this);
                pl.Status = PlayerStatus.Connecting;
                TimerCallback tm = new TimerCallback(ConnectTimeout);
                t = new Timer(tm, pl.PlayerToken, (int)ConnectTime.TotalMilliseconds, Timeout.Infinite);
                if (PlayersNumber == 2)
                {
                    status = LobbyStatus.Full;
                }
            }
        }

        private void ConnectTimeout(object obj)
        {
            string token = (string)obj;
            if (players.ContainsKey(token) && players[token].Status == PlayerStatus.Connecting)
            {
                DisconnectPlayer(token);
            }
        }

        private bool CheckReadyStatus()
        {
            var ret = true;
            Monitor.Enter(players);
            foreach (var p in players)
            {
                if(p.Value.Status != PlayerStatus.Ready)
                {
                    ret = false;
                }
            }
            Monitor.Exit(players);
            return ret;
        }

        public void DisconnectPlayer(string token)
        {
            Monitor.Enter(players);
            players[token].DisconnectFromLobby();
            players.Remove(token);
            Router.UnregisterLobbyRoute(token);
            Monitor.Exit(players);
            if ((status == LobbyStatus.StartedRun || status == LobbyStatus.Started)  && players.Count < 2)
            {
                GM.KillCharacter(token);
            }
            else
            {
                status = LobbyStatus.WaitingForPlayer;
            }
            if(players.Count == 0)
            {
                FinishGame();
            }
        }

        public void ChangePlayerStatus(string token, bool status)
        {
            if(status)
            {
                players[token].Status = PlayerStatus.Ready;
            }
            else
            {
                players[token].Status = PlayerStatus.Connected;
            }
            bool ready = CheckReadyStatus();
            if(ready)
            {
                StartGame();
            }
        }

        public bool MoveCharacter(string token, string dir)
        {
            if(status != LobbyStatus.StartedRun)
            {
                return false;
            }
            bool moved = GM.MoveCharacter(token, dir);
            return moved;
        }

        public bool PlaceTrap(string token, string trap, int xpos, int ypos, out bool placed)
        {
            placed = false;
            if(status != LobbyStatus.Started)
            {
                return false;
            }
            bool show = GM.PlaceTrap(token, trap, xpos, ypos, out placed);
            return show;
        }

        public Player GetPlayer(string token)
        {
            if(!players.ContainsKey(token))
            {
                return null;
            }
            return players[token];
        }

        private void StartGame()
        {
            TimerCallback tm = new TimerCallback(EndStartCount);
            StartCount = new Timer(tm, null, (int)StartTime.TotalMilliseconds, Timeout.Infinite);
        }

        private void EndStartCount(object obj)
        {
            if (players.Count == 2)
            {
                List<Player> gamePlayers = players.Values.ToList();
                for (int i = 0; i < gamePlayers.Count; i++)
                {
                    if(gamePlayers[i].Status != PlayerStatus.Ready)
                    {
                        return;
                    }
                }
                status = LobbyStatus.Started;
                GM = new GameManager(this);
                Field f = GM.InitializeSimpleGame(gamePlayers[0].PlayerToken, gamePlayers[0].Nickname,
                    gamePlayers[1].PlayerToken, gamePlayers[1].Nickname);
                for(int i = 0; i < gamePlayers.Count; i++)
                {
                    Player p = gamePlayers[i];
                    Router.SendMessage(p.WSContext, "START_GAME", new WSStartGame(f));
                }
                TimerCallback tm = new TimerCallback(StartRun);
                StartCount = new Timer(tm, null, (int)PrepareTime.TotalMilliseconds, Timeout.Infinite);
            }
        }

        private void StartRun(object obj)
        {
            List<Player> gamePlayers = players.Values.ToList();
            status = LobbyStatus.StartedRun;
            GM.StartRun();
            for (int i = 0; i < gamePlayers.Count; i++)
            {
                Player p = gamePlayers[i];
                Router.SendMessage(p.WSContext, "START_RUN");
            }
            /*
            TimerCallback tm = new TimerCallback(clock);
            StartCount = new Timer(tm, null, 1, Timeout.Infinite);
            */
        }

        /*
        private void clock(object obj)
        {
            List<Player> gamePlayers = players.Values.ToList();
            status = LobbyStatus.StartedRun;
            for (int i = 0; i < gamePlayers.Count; i++)
            {
                Player p = gamePlayers[i];
                Router.SendMessage(p.WSContext, "%d;u 0x512987391 && 0x000013145");
            }
            TimerCallback tm = new TimerCallback(fun);
            StartCount = new Timer(tm, null, 1, 1);
        }

        private void fun(object obj)
        {
            List<Player> gamePlayers = players.Values.ToList();
            status = LobbyStatus.StartedRun;

            Random r = new Random();
            int len = r.Next(5, 15);
            string text = "";
            for (int i = 0; i < len; i++)
            {
                text += (char)r.Next(0, 255);
            }

            for (int i = 0; i < gamePlayers.Count; i++)
            {
                Player p = gamePlayers[i];
                Router.SendMessage(p.WSContext, text);
            }
        }
        */

        public List<Player> GetPlayerList()
        {
            List<Player> pls = new List<Player>();
            Monitor.Enter(players);
            foreach (var p in players)
            {
                pls.Add(p.Value);
            }
            Monitor.Exit(players);
            return pls;
        }

        private void FinishGame()
        {
            List<Player> gamePlayers = players.Values.ToList();
            for (int i = 0; i < gamePlayers.Count; i++)
            {
                gamePlayers[i].DisconnectFromLobby();
                //players.Remove(gamePlayers[i].PlayerToken);
                Router.UnregisterLobbyRoute(gamePlayers[i].PlayerToken);
            }
            Lobbies.RemoveLobby(this.id);
        }

        public void NotifyShowTrap(int xpos, int ypos, Modificator modif)
        {
            List<Player> gamePlayers = players.Values.ToList();
            for (int i = 0; i < gamePlayers.Count; i++)
            {
                Player p = gamePlayers[i];
                Router.SendMessage(p.WSContext, "SHOW_TRAP", new WSShowTrapResponse(xpos, ypos, modif.ToString()));
            }
        }

        public void NotifyKillCharacter(string nickname)
        {
            List<Player> gamePlayers = players.Values.ToList();
            for (int i = 0; i < gamePlayers.Count; i++)
            {
                Player p = gamePlayers[i];
                Router.SendMessage(p.WSContext, "KILL_CHAR", new WSKillResponse(nickname));
            }
        }

        public void NotifyFinish(string nickname)
        {
            List<Player> gamePlayers = players.Values.ToList();
            for (int i = 0; i < gamePlayers.Count; i++)
            {
                Player p = gamePlayers[i];
                Router.SendMessage(p.WSContext, "FINISH", new WSFinishResponse(nickname));
               
            }
            FinishGame();
        }

        public void NotifyDraw()
        {
            List<Player> gamePlayers = players.Values.ToList();
            for (int i = 0; i < gamePlayers.Count; i++)
            {
                Player p = gamePlayers[i];
                Router.SendMessage(p.WSContext, "DRAW");
            }
            FinishGame();
        }

        public void NotifyActivatedTrap(int xpos, int ypos, Modificator modif)
        {
            List<Player> gamePlayers = players.Values.ToList();
            for (int i = 0; i < gamePlayers.Count; i++)
            {
                Player p = gamePlayers[i];
                Router.SendMessage(p.WSContext, "ACTIVATED_TRAP", new WSActivatedResponse(xpos, ypos, modif.ToString()));
            }
        }

        public void NotifyRemoveTrap(int xpos, int ypos)
        {
            List<Player> gamePlayers = players.Values.ToList();
            for (int i = 0; i < gamePlayers.Count; i++)
            {
                Player p = gamePlayers[i];
                Router.SendMessage(p.WSContext, "REMOVE_TRAP", new WSRemoveTrap(xpos, ypos));
            }
        }
    }
}
