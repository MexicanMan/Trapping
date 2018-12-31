using Server.Model.Util;
using ProjectAstolfo.Model.Util;
using System;

namespace ProjectAstolfo.Model.Game
{
    public static class FieldGenerator
    {
        public static Field GenerateSimpleField(INotifier notifier)
        {
            Field field = new Field(notifier);
            //field.CreateEmptyField(10, 10);
            field.CreateTestField();

            Zone start = new RectangleZone(3, 1, 1, 6);
            Zone finish = new RectangleZone(7, 7, 4, 4);
            field.SetStartFinish(start, finish);

            Random r = new Random();
            int bombCount = r.Next(1, 3);
            int pitfallCount = r.Next(2, 3);
            field.InitializeNewTrap(Modificator.Ice, bombCount);
            field.InitializeNewTrap(Modificator.Pitfall, pitfallCount);

            return field;
        }
    }
}
