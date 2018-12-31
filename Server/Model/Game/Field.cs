using System;
using System.Collections.Generic;
using Server.Model;
using Server.Model.Util;
using ProjectAstolfo.Model.Util;

namespace ProjectAstolfo.Model.Game
{
    //Само игровое поле
    public class Field : INotifier
    {
        private int width;
        private int height;

        private Cell[][] cells;

        private Zone startZone;
        private Zone finishZone;

        private List<Character> characters = new List<Character>();

        private Dictionary<Modificator, int> trapList = new Dictionary<Modificator, int>();

        private int finishedPlayerId = -1;

        private INotifier EventNotifier;

        public int FinishedPlayerId
        {
            get
            {
                return finishedPlayerId;
            }
            set
            {
                finishedPlayerId = value;
            }
        }


        public int Width
        {
            get
            {
                return width;
            }
            set
            {
                width = value;
            }
        }

        public int Height
        {
            get
            {
                return height;
            }
            set
            {
                height = value;
            }
        }

        public Cell this[int vertIndex, int horIndex]
        {
            get
            {
                if(cells == null || cells.Length < vertIndex || cells[0].Length < horIndex)
                {
                    return null;
                }
                else
                {
                    return cells[vertIndex][horIndex];
                }
            }

            set
            {
                if (cells != null || cells.Length >= vertIndex || cells[0].Length >= horIndex)
                {
                    cells[vertIndex][horIndex] = value;
                }
                
            }
        }

        public Zone StartZone
        {
            get
            {
                return startZone;
            }
        }

        public Zone FinishZone
        {
            get
            {
                return finishZone;
            }
        }

        public List<Character> CharacterList
        {
            get
            {
                return characters;
            }
        }

        public Dictionary<Modificator, int> TrapList
        {
            get
            {
                return trapList;
            }
        }

        public Field(INotifier notifier)
        {
            EventNotifier = notifier;
        }

        public void CreateEmptyField(int wid, int len)
        {
            if(wid <= 0 || len <= 0)
            {
                throw new Exception("Can't create that field :/");
            }
            height = len;
            width = wid;
            cells = new Cell[len][];
            for(int i = 0; i < len; i++)
            {
                cells[i] = new Cell[wid];
                for(int j = 0; j < wid; j++)
                {
                    cells[i][j] = new Cell(new DiscreteCoordinates(i, j), this, CellType.Grass);
                }
            }
        }

        public void CreateTestField()
        {
            int[,] map =  new int[,] 
            { 
                { 5, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                { 5, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                { 5, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                { 0, 5, 5, 0, 5, 0, 0, 5, 0, 0 },
                { 0, 0, 0, 0, 0, 0, 5, 5, 0, 0 },
                { 0, 5, 5, 0, 0, 0, 0, 0, 0, 0 },
                { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
            };
            int len = 10;
            int wid = 10;
            height = len;
            width = wid;
            cells = new Cell[len][];
            for (int i = 0; i < len; i++)
            {
                cells[i] = new Cell[wid];
                for (int j = 0; j < wid; j++)
                {
                    cells[i][j] = new Cell(new DiscreteCoordinates(j, i), this, (CellType)map[i,j]);
                }
            }
        }

        public void SetStartFinish(Zone start, Zone finish)
        {
            if(start == null || finish == null)
            {
                throw new Exception("Zones must be not null");
            }
            startZone = start;
            finishZone = finish;
        }

        public void AddCharacter(int playerId, string nickname)
        {
            if(characters.Count >= 2)
            {
                throw new Exception("There's no support for more than 2 players :/");
            }
            else
            {
                Character ch = new Character(playerId, nickname, trapList, this);
                characters.Add(ch);
            }
        }

        private void PlaceCharacters()
        {
            if(startZone.AreaSize() < characters.Count)
            {
                throw new Exception("Can't place "+ characters.Count + " characters in zone less than 2 cells!");
            }
            for(int i = 0; i < characters.Count; i++)
            {
                var coord = startZone.CellsCoords()[i];
                characters[i].Coordinates = coord;
            }
        }

        public void PrepareFieldForStart()
        {
            if(startZone == null || finishZone == null || width*height < 4)
            {
                throw new Exception("Can't prepare field for start!");
            }
            PlaceCharacters();
        }


        //Сделано тупо, но можно исправить, переделав список в словарь
        //Тупо - это поиск игрока по id
        public bool MoveCharacter(int playerId, DiscreteCoordinates coords)
        {
            bool ret = false;
            for(int i = 0; i < characters.Count; i++)
            {
                Character charact = characters[i];
                if (charact.PlayerId == playerId)
                {
                    DiscreteCoordinates newCoords = charact.Coordinates + coords;
                    if (CanMoveToCell(charact, newCoords))
                    {
                        charact.Move(coords);
                        int xpos = newCoords.X;
                        int ypos = newCoords.Y;
                        this[ypos, xpos].MoveIn(charact);
                        ret = true;
                        if(finishZone.IsInZone(charact.Coordinates) && FinishedPlayerId < 0)
                        {
                            FinishedPlayerId = charact.PlayerId;
                            NotifyFinish(charact.PlayerName);
                        }
                    }
                }
            }
            return ret;
        }


        //Убрать возвращаемое значение, заменить его placed-ом 
        //и вызвать NotifyShow в ячейке при установке(с обработкой типа - невидимые\видимые)
        public bool PlaceTrap(int playerId, Modificator trap, DiscreteCoordinates coords, out bool placed)
        {
            bool ret = false;
            placed = false;
            for (int i = 0; i < characters.Count; i++)
            {
                Character charact = characters[i];
                if (charact.PlayerId == playerId)
                {
                    if (charact.CanPlaceTrap(trap) && CanPlaceTrapOnCell(coords))
                    {
                        charact.PlaceTrap(trap);
                        placed = true;
                        this[coords.Y, coords.X].AddModificator(trap);
                        ret = true;
                    }
                }
            }
            return ret;
        }

        public void KillCharacter(int playerId)
        {
            for (int i = 0; i < characters.Count; i++)
            {
                Character charact = characters[i];
                if (charact.PlayerId == playerId)
                {
                    charact.Die();
                }
            }
        }

        public void InitializeNewTrap(Modificator trap, int count)
        {
            if(trapList.ContainsKey(trap))
            {
                trapList[trap] += count;
            }
            else
            {
                trapList.Add(trap, count);
            }
        }

        private bool CanMoveToCell(Character ch, DiscreteCoordinates coords)
        {
            if(!ch.CanMove())
            {
                return false;
            }
            if ((coords.Y >= 0 && coords.Y < cells.Length) &&
                (coords.X >= 0 && coords.X < cells[0].Length))
            {
                if (!this[coords.Y, coords.X].IsPassable())
                {
                    return false;
                }
                return true;
            }
            return false;
        }

        private bool CanPlaceTrapOnCell(DiscreteCoordinates coords)
        {
            bool ret = true;
            if (startZone.IsInZone(coords) || finishZone.IsInZone(coords))
            {
                ret = false;
            }
            return ret;
        }

        public void NotifyShowTrap(int xpos, int ypos, Modificator modif)
        {
            EventNotifier.NotifyShowTrap(xpos, ypos, modif);
        }

        public void NotifyKillCharacter(string nickname)
        {
            EventNotifier.NotifyKillCharacter(nickname);
            bool draw = true;
            for(int i = 0; i < characters.Count; i++)
            {
                if(characters[i].Status != CharacterStatus.Died)
                {
                    draw = false;
                }
            }
            if(draw)
            {
                NotifyDraw();
            }
        }

        public void NotifyFinish(string nickname)
        {
            EventNotifier.NotifyFinish(nickname);
        }

        public void NotifyDraw()
        {
            EventNotifier.NotifyDraw();
        }

        public void NotifyActivatedTrap(int xpos, int ypos, Modificator modif)
        {
            EventNotifier.NotifyActivatedTrap(xpos, ypos, modif);
        }

        public void NotifyRemoveTrap(int xpos, int ypos)
        {
            EventNotifier.NotifyRemoveTrap(xpos, ypos);
        }

    }
}
