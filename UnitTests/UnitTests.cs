using Microsoft.VisualStudio.TestTools.UnitTesting;
using ProjectAstolfo.Model;
using ProjectAstolfo.Model.Game;
using ProjectAstolfo.Model.Util;
using Moq;

namespace UnitTests
{
    [TestClass]
    public class UnitTests
    {
        [TestMethod]
        public void FieldSizeTest()
        {
            Field f = new Field();
            f.CreateEmptyField(4, 5);
            Assert.AreEqual(f.Height, 5);
            Assert.AreEqual(f.Width, 4);
        }

        [TestMethod]
        public void RectangleZoneSizeTest()
        {
            RectangleZone zone = new RectangleZone(4,2,1,4);
            Assert.AreEqual(zone.AreaSize(), 12);
            zone = new RectangleZone(3, 5, 6, 1);
            Assert.AreEqual(zone.AreaSize(), 18);
        }

        [TestMethod]
        public void IsInZoneTest()
        {
            RectangleZone zone = new RectangleZone(1, 4, 1, 4);
            Assert.IsTrue(zone.IsInZone(3, 2));
        }

        [TestMethod]
        public void IsNotInZoneTest()
        {
            RectangleZone zone = new RectangleZone(1, 4, 1, 4);
            Assert.IsFalse(zone.IsInZone(10, 12));
        }


        [TestMethod]
        public void EmptyCoordinatesTest()
        {
            var dsk = new DiscreteCoordinates();
            Assert.AreEqual(dsk.X, 0);
            Assert.AreEqual(dsk.Y, 0);
        }

        [TestMethod]
        public void FullCoordinatesTest()
        {
            var dsk = new DiscreteCoordinates(5, 4);
            Assert.AreEqual(dsk.X, 5);
            Assert.AreEqual(dsk.Y, 4);
        }

        [TestMethod]
        public void PlayerTest()
        {
            var pl = new Player("123", "s");
            Assert.AreEqual(pl.PlayerToken, "123");
        }

        [TestMethod]
        public void TestFieldFinish()
        {
            Field f = new Field();
            f.CreateEmptyField(8, 8);
            f.AddCharacter(1);
            f.AddCharacter(2);
            var mockFinish = new Mock<Zone>();
            var mockStart = new Mock<Zone>();
            mockFinish.Setup(a => a.IsInZone(It.IsAny<DiscreteCoordinates>())).Returns(true);
            mockStart.Setup(a => a.AreaSize()).Returns(10);
            var cellList = new System.Collections.Generic.List<DiscreteCoordinates>();
            for(int i = 0; i < 10; i++)
            {
                cellList.Add(new DiscreteCoordinates(0, 0));
            }
            mockStart.Setup(a => a.CellsCoords()).Returns(cellList);
            f.SetStartFinish(mockStart.Object, mockFinish.Object);
            f.PrepareFieldForStart();
            f.MoveCharacter(2, new DiscreteCoordinates(0,0));
            Assert.AreEqual(f.FinishedPlayerId, 2);
        }

        [TestMethod]
        public void TestFieldStartPlacing()
        {
            Field f = new Field();
            f.CreateEmptyField(8, 8);
            f.AddCharacter(1);
            f.AddCharacter(2);
            var mockFinish = new Mock<Zone>();
            var mockStart = new Mock<Zone>();
            mockFinish.Setup(a => a.IsInZone(It.IsAny<int>(), It.IsAny<int>())).Returns(true);
            mockStart.Setup(a => a.AreaSize()).Returns(1);
            f.SetStartFinish(mockStart.Object, mockFinish.Object);
            Assert.ThrowsException<System.Exception>(() => f.PrepareFieldForStart());
        }
    }
}
