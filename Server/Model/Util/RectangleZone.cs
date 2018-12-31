
using System.Collections.Generic;

namespace ProjectAstolfo.Model.Util
{
    public class RectangleZone : Zone
    {
        //Важно учесть, что линии представляют собой пограничные индексы матрицы, в границах которых и считается наличие зоны
        private int upperLine;
        private int downLine;
        private int leftLine;
        private int rightLine;

        public RectangleZone(int up, int down, int left, int right)
        {
            if(up < down)
            {
                upperLine = down;
                downLine = up;
            }
            else
            {
                upperLine = up;
                downLine = down;
            }
            if (left > right)
            {
                leftLine = right;
                rightLine = left;
            }
            else
            {
                leftLine = left;
                rightLine = right;
            }
        }

        public int Up
        {
            get
            {
                return upperLine;
            }
        }

        public int Down
        {
            get
            {
                return downLine;
            }
        }

        public int Left
        {
            get
            {
                return leftLine;
            }
        }

        public int Right
        {
            get
            {
                return rightLine;
            }
        }

        public bool IsInZone(int coordX, int coordY)
        {
            int cx = coordX;
            int cy = coordY;
            if((cx >= leftLine && cx <= rightLine) && (cy <= upperLine && cy >= downLine))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsInZone(DiscreteCoordinates coords)
        {
            if(coords == null)
            {
                return false;
            }
            int cx = coords.X;
            int cy = coords.Y;
            if ((cx >= leftLine && cx <= rightLine) && (cy <= upperLine && cy >= downLine))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public int AreaSize()
        {
            return (rightLine - leftLine + 1) * (upperLine - downLine + 1);
        }

        public List<DiscreteCoordinates> CellsCoords()
        {
            List<DiscreteCoordinates> coords = new List<DiscreteCoordinates>();
            for(int y = downLine; y <= upperLine; y++)
            {
                for(int x = leftLine; x <= rightLine; x++)
                {
                    coords.Add(new DiscreteCoordinates(x, y));
                }
            }
            return coords;
        }
    }
}
