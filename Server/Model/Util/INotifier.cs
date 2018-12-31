using ProjectAstolfo.Model.Game;
using ProjectAstolfo.Model.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Model.Util
{
    public interface INotifier
    {
        void NotifyShowTrap(int xpos, int ypos, Modificator modif);

        void NotifyKillCharacter(string nickname);

        void NotifyFinish(string nickname);

        void NotifyDraw();

        void NotifyActivatedTrap(int xpos, int ypos, Modificator modif);

        void NotifyRemoveTrap(int xpos, int ypos);
    }
}
