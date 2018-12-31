using System.Collections.Generic;

namespace ProjectAstolfo.Model.Util
{
    //Не ну а шо?
    public interface Zone
    {
        bool IsInZone(int coordX, int coordY);
        bool IsInZone(DiscreteCoordinates coords);
        int AreaSize();

        List<DiscreteCoordinates> CellsCoords();
    }
}
