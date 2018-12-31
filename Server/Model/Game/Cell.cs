
using Server.Model;
using ProjectAstolfo.Model.Util;
using System.Collections.Generic;

namespace ProjectAstolfo.Model.Game
{
    public enum CellType
    {
        Grass,
        Snow,
        Rock,
        Stalinium,
        Sand,
        Void
    }

    public enum Modificator
    {
        None,
        Hole,
        Ice,
        Bomb,
        Pitfall,
        Adverstiment
    }


    public class Cell
    {
        private CellType cellType;
        private Modificator modificator = Modificator.None;
        private double chance = 100;
        private  Dictionary<int, Character> characters = new Dictionary<int, Character>();
        private DiscreteCoordinates coordinates;

        private double FrostStunTime = 2;

        private Field f;

        public Cell(DiscreteCoordinates coords, Field f, CellType ct = CellType.Void)
        {
            cellType = ct;
            coordinates = coords;
            this.f = f;
        }

        public CellType type
        {
            get
            {
                return cellType;
            }
        }

        public bool AddModificator(Modificator mod)
        {
            if(mod == modificator)
            {
                return false;
            }
            else
            {
                if(modificator != Modificator.None)
                {
                    f.NotifyRemoveTrap(coordinates.X, coordinates.Y);
                }
                modificator = mod;
                return true;
            }
        }

        public bool HasModificator()
        {
            return modificator != Modificator.None;
        }

        public bool IsPassable()
        {
            bool ans = true;
            if(cellType == CellType.Void)
            {
                ans = false;
            }
            return ans;
        }

        public void MoveIn(Character ch)
        {
            switch (modificator)
            {
                case Modificator.None:
                    {
                        break;
                    }
                case Modificator.Ice:
                    {
                        MoveIntoIce(ch);
                        modificator = Modificator.None;
                        break;
                    }
                case Modificator.Pitfall:
                    {
                        MoveIntoPitfall(ch);
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
        }

        public void MoveOut(Character ch)
        {
            characters.Remove(ch.PlayerId);
        }

        //Плохо что здесь все enum, но так проще и быстрее.

        private void MoveIntoIce(Character ch)
        {
            ch.Stun(FrostStunTime);
            f.NotifyActivatedTrap(coordinates.X, coordinates.Y, Modificator.Ice);
        }

        private void MoveIntoPitfall(Character ch)
        {
            ch.Die();
            f.NotifyActivatedTrap(coordinates.X, coordinates.Y, Modificator.Pitfall);
        }
    }
}
