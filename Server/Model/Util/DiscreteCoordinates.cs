
namespace ProjectAstolfo.Model.Util
{
    public class DiscreteCoordinates
    {
        private int x;
        private int y;

        public int X
        {
            get
            {
                return x;
            }
            set
            {
                x = value;
            }
        }
        public int Y
        {
            get
            {
                return y;
            }
            set
            {
                y = value;
            }
        }


        public DiscreteCoordinates()
        {
            x = 0;
            y = 0;
        }

        public DiscreteCoordinates(int xCoord, int yCoord)
        {
            x = xCoord;
            y = yCoord;
        }

        public static DiscreteCoordinates operator + (DiscreteCoordinates coord1, DiscreteCoordinates coord2)
        {
            return new DiscreteCoordinates(coord1.X + coord2.X, coord1.Y + coord2.Y);
        }

        public static DiscreteCoordinates operator -(DiscreteCoordinates coord1, DiscreteCoordinates coord2)
        {
            return new DiscreteCoordinates(coord1.X - coord2.X, coord1.Y - coord2.Y);
        }
    }
}
