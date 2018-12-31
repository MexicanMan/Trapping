using ProjectAstolfo.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Server
{
    public static class TokenManager
    {
        private static Dictionary<string, DateTime> tokenList = new Dictionary<string, DateTime>();
        private static object locker = new object();
        private static TimeSpan timeout = TimeSpan.FromHours(1);
        private static Dictionary<string, Player> users = new Dictionary<string, Player>();

        static TokenManager()
        {
            TimerCallback tm = new TimerCallback(ClearOldUsers);
            int time = (int)timeout.TotalMilliseconds;

            Timer timer = new Timer(tm, null, 0, time);
        }

        public static string RegisterUserToken(int id, string username)
        {
            string token = Hash.HashId(id);
            DateTime time = DateTime.Now;

            lock (locker)
            {
                if (tokenList.Keys.Contains(token))
                {
                    tokenList[token] = time;
                }
                else
                {
                    Player p = new Player(token, username);
                    AddUser(p);
                }
            }

            return token;
        }

        public static bool CheckUser(string token)
        {
            bool checkRes = false;

            lock (locker)
            {
                if(tokenList.Keys.Contains(token))
                {
                    tokenList[token] = DateTime.Now;
                    checkRes = true;
                }
            }

            return checkRes;
        }

        private static void ClearOldUsers(object obj)
        {
            lock (locker)
            {
                DateTime now = DateTime.Now;
                List<string> keysToRemove = new List<string>();

                foreach(var pair in tokenList)
                {
                    if((now - pair.Value).TotalMilliseconds >  timeout.Milliseconds)
                    {
                        keysToRemove.Add(pair.Key);
                    }
                }

                for(int i = 0; i < keysToRemove.Count; i++)
                {
                    RemoveUser(keysToRemove[i]);
                }

                keysToRemove.Clear();
            }
        }

        private static void AddUser(Player p)
        {
            lock (locker)
            {
                tokenList.Add(p.PlayerToken, DateTime.Now);
                users.Add(p.PlayerToken, p);
            }
        }

        private static void RemoveUser(string token)
        {
            lock (locker)
            {
                tokenList.Remove(token);
                users.Remove(token);
            }
        }

        public static Player GetPlayer(string token)
        {
            Player p = null;
            lock (locker)
            {
                if (tokenList.ContainsKey(token))
                {
                    p = users[token];
                    tokenList[token] = DateTime.Now;
                }
                else
                {
                    throw new Exception("Такого токена нет в списке пользователей");
                }
            }
            return p;
        }

    }
}
