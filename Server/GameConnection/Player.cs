using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using WebSocketSharp.Net.WebSockets;

namespace ProjectAstolfo.Model
{
    public enum PlayerStatus
    {
        Default,
        Connecting,
        Connected,
        Reconnecting,
        Ready
    }

    public class Player
    {
        private static int maxId = 1;
        private string token;
        private int id;
        private PlayerStatus status;
        private string nickname;
        private static TimeSpan PingTime = TimeSpan.FromSeconds(2);
        private WebSocketContext wsContext;
        private Timer t;

        public int Id
        {
            get
            {
                return id;
            }
        }

        public string PlayerToken
        {
            get
            {
                return token;
            }
        }

        public string Nickname
        {
            get
            {
                return nickname;
            }
        }

        public PlayerStatus Status
        {
            get
            {
                return status;
            }
            set
            {
                status = value;
            }
        }

        public WebSocketContext WSContext
        {
            get
            {
                return wsContext;
            }
        }

        public Player(string token, string nickname)
        {
            this.nickname = nickname;
            this.token = token;
            id = maxId;
            maxId++;
            status = PlayerStatus.Default;
        }

        public void ConnectToLobby(WebSocketContext wsContext)
        {
            this.wsContext = wsContext;
            TimerCallback tm = new TimerCallback(Ping);
            int time = (int)PingTime.TotalMilliseconds;
            Status = PlayerStatus.Connected;
            t = new Timer(tm, null, 0, time);
        }

        public void DisconnectFromLobby()
        {
            Status = PlayerStatus.Default;
            if (t != null)
            {
                t.Dispose();
            }
        }

        public void Ping(object obj)
        {
            Router.SendPing(this.wsContext, PlayerToken);
        }

    }
}
