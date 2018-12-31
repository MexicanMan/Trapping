
using ProjectAstolfo.Model.Util;
using System.Threading;
using System.Collections.Generic;
using Server.Model;

namespace ProjectAstolfo.Model.Game
{
    public enum CharacterStatus
    {
        Ready,
        Running,
        Finished,
        Stunned,
        Died
    }

    public class Character
    {
        private int playerId;
        private string nickname;
        private DiscreteCoordinates coords;
        private CharacterStatus status = CharacterStatus.Ready;

        private Dictionary<Modificator, int> trapList = new Dictionary<Modificator, int>();

        private Timer t;

        private Field f;

        public DiscreteCoordinates Coordinates
        {
            get
            {
                return new DiscreteCoordinates(coords.X, coords.Y);
            }
            set
            {
                coords = value;
            }
        }

        public int PlayerId
        {
            get
            {
                return playerId;
            }
        }

        public string PlayerName
        {
            get
            {
                return nickname;
            }
        }

        public CharacterStatus Status
        {
            get
            {
                return status;
            }
        }

        public Character(int playerId, string nickname, Dictionary<Modificator, int> traps, Field f)
        {
            this.playerId = playerId;
            this.nickname = nickname;
            foreach(var trap in traps)
            {
                trapList.Add(trap.Key, trap.Value);
            }
            this.f = f;
        }

        public void Move(DiscreteCoordinates coords)
        {
            this.Coordinates += coords;
        }

        public bool CanMove()
        {
            if (status == CharacterStatus.Running)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool CanPlaceTrap(Modificator modif)
        {
            bool ret = false;
            if(trapList.ContainsKey(modif) && trapList[modif] > 0)
            {
                ret = true;
            }
            return ret;
        }

        public void PlaceTrap(Modificator modif)
        {
            if (trapList.ContainsKey(modif) && trapList[modif] > 0)
            {
                trapList[modif]--;
            }
        }

        public void PrepareForRun()
        {
            status = CharacterStatus.Running;
        }

        public void Stun(double seconds)
        {
            this.status = CharacterStatus.Stunned;
            TimerCallback tm = new TimerCallback(EndStun);
            t = new Timer(tm, null, (int)seconds * 1000, Timeout.Infinite);
        }

        public void Die()
        {
            this.status = CharacterStatus.Died;
            f.NotifyKillCharacter(this.nickname);
        }

        private void EndStun(object obj)
        {
            this.status = CharacterStatus.Running;
        }

    }
}
