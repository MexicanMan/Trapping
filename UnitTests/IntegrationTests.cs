using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;
using HttpServer;
using ProjectAstolfo.Model.Game;
using ProjectAstolfo.Model.Util;

namespace UnitTests
{
    [TestClass]
    public class IntegrationTests
    {
        [TestMethod]
        public void TokenManagerTest()
        {
            int id = 12;
            string token = TokenManager.RegisterUserToken(id, "s");
            string hash = Hash.HashId(id);
            Assert.IsTrue(TokenManager.CheckUser(hash));
        }

        [TestMethod]
        public void LobbiesTest()
        {
            Lobby l = new Lobby("Lobby");
            l.ConnectPlayer(new ProjectAstolfo.Model.Player("PlayerToken", "s"));
            Lobbies.AddLobby(l);
            var x = Lobbies.getLobbiesResponse();
            Assert.AreEqual(x.lobbyResponses[0].name, "Lobby");
        }

        [TestMethod]
        public void ConnectionManagerTest()
        {
            var cm = new SqliteConnectionManager();
            int id = cm.RegisterUser("Vasya123", "qwe@yandex.ru", "qwerty123");
            Assert.IsTrue(cm.CheckEmail("qwe@yandex.ru"));
            Assert.IsTrue(cm.CheckUsername("Vasya123"));
            Assert.AreEqual(cm.CheckUser("qwe@yandex.ru", "qwerty123").token, id.ToString());
        }

        [TestMethod]
        public void FieldTest()
        {
            Field f = FieldGenerator.GenerateSimpleField();
            Assert.AreEqual(f.Width, 8);
            Assert.AreEqual(f.Height, 8);
            f.SetStartFinish(new RectangleZone(1, 2, 1, 2), new RectangleZone(6, 7, 6, 7));
            f.AddCharacter(1);
            f.AddCharacter(2);
            f.PrepareFieldForStart();
            f.MoveCharacter(1, new DiscreteCoordinates(6, 6));
            Assert.AreEqual(f.FinishedPlayerId, 1);
        }

        [TestMethod]
        public void ZoneTest()
        {
            DiscreteCoordinates coords = new DiscreteCoordinates(1, 2);
            Zone z1 = new RectangleZone(4, 5, 5, 6);
            Zone z2 = new RectangleZone(-1, 7, -3, 8);
            Assert.IsFalse(z1.IsInZone(coords));
            Assert.IsTrue(z2.IsInZone(coords));
        }
    }
}
