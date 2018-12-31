using Newtonsoft.Json;
using ProjectAstolfo.Model.Game;
using ProjectAstolfo.Model.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Json
{
    [JsonObject]
    public class WSStartGame
    {
        [JsonProperty("field")]
        public WSField field { get; set; }

        [JsonProperty("characters")]
        public List<WSCharacter> characters { get; set; }

        [JsonProperty("traps")]
        public List<WSTrap> traps { get; set; }

        [JsonProperty("finish")]
        public WSFinish finish { get; set; }

        [JsonProperty("start")]
        public WSStart start { get; set; }

        public WSStartGame(Field f)
        {
            characters = new List<WSCharacter>();
            traps = new List<WSTrap>();
            field = new WSField(f);
            List<Character> chars = f.CharacterList;
            Dictionary<Modificator, int> trapList = f.TrapList;
            RectangleZone start = (RectangleZone)f.StartZone;
            RectangleZone finish = (RectangleZone)f.FinishZone;
            for (int i = 0; i < chars.Count; i++)
            {
                characters.Add(new WSCharacter(chars[i]));
            }
            foreach(var trap in trapList)
            {
                traps.Add(new WSTrap(trap.Key, trap.Value));
            }
            this.start = new WSStart(start);
            this.finish = new WSFinish(finish);
        }
    }

    [JsonObject]
    public class WSField
    {
        [JsonProperty("width")]
        public int width { get; set; }

        [JsonProperty("height")]
        public int height { get; set; }

        [JsonProperty("cells")]
        public string cells { get; set; }

        public WSField(Field f)
        {
            width = f.Width;
            height = f.Height;
            for(int i = 0; i < f.Height; i++)
            {
                for(int j = 0; j < f.Width; j++)
                {
                    cells += ((byte)f[i, j].type).ToString() + " ";
                }
            }
        }
    }

    [JsonObject]
    public class WSCharacter
    {
        [JsonProperty("nickname")]
        public string nickname { get; set; }

        [JsonProperty("xpos")]
        public int xpos { get; set; }

        [JsonProperty("ypos")]
        public int ypos { get; set; }

        public WSCharacter(Character ch)
        {
            nickname = ch.PlayerName;
            xpos = ch.Coordinates.X;
            ypos = ch.Coordinates.Y;
        }
    }

    [JsonObject]
    public class WSTrap
    {
        [JsonProperty("trap")]
        public string trap { get; set; }

        [JsonProperty("count")]
        public int count { get; set; }

        public WSTrap(Modificator trap, int count)
        {
            this.trap = trap.ToString();
            this.count = count;
        }
    }

    [JsonObject]
    public class WSStart
    {
        [JsonProperty("left")]
        public int left { get; set; }

        [JsonProperty("right")]
        public int right { get; set; }

        [JsonProperty("up")]
        public int up { get; set; }

        [JsonProperty("down")]
        public int down { get; set; }

        public WSStart(RectangleZone start)
        {
            left = start.Left;
            right = start.Right;
            up = start.Up;
            down = start.Down;
        }
    }

    [JsonObject]
    public class WSFinish
    {
        [JsonProperty("xpos")]
        public int xpos { get; set; }

        [JsonProperty("ypos")]
        public int ypos { get; set; }

        public WSFinish(RectangleZone finish)
        {
            xpos = finish.Left;
            ypos = finish.Up;
        }
    }
}
