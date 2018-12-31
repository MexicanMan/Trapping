using HttpServer.Controllers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;
using ProjectAstolfo.Json;
using Microsoft.AspNetCore.Mvc;
using HttpServer;

namespace UnitTests
{
    [TestClass]
    public class AnotherTests
    {
        [TestMethod]
        public void AuthTest()
        {
            AuthController ac = new AuthController();
            IActionResult ar = ac.Post(
                new Auth(
                    new AuthParameters("qwe@yandex.ru", "qwerty123")));
            OkObjectResult res = (OkObjectResult)ar;
            Response r = (Response)res.Value;
            Assert.AreEqual(r.error, "");
            TokenResponse tr = (TokenResponse)r.payload;
            Assert.AreEqual(tr.nickname, "Vasya123");
        }

        [TestMethod]
        public void RegistrTest()
        {
            RegisterController ac = new RegisterController();
            IActionResult ar = ac.Post(
                new Register(
                    new RegisterParametres("OstapBender1921", "qwe@yandex.ru", "klychotkvartiry")));
            OkObjectResult res = (OkObjectResult)ar;
            Response r = (Response)res.Value;
            Assert.AreEqual(r.error, "Такой е-mail уже был зарегистрирован");


            ar = ac.Post(
                new Register(
                    new RegisterParametres("Vasya123", "ztelenok@odessa.su", "klychotkvartiry")));
            res = (OkObjectResult)ar;
            r = (Response)res.Value;
            Assert.AreEqual(r.error, "Пользователь с таким именем уже зарегистрирован");
        }

        [TestMethod]
        public void LobbiesTest()
        {
            string token = TokenManager.RegisterUserToken(123, "s");
            LobbiesController ac = new LobbiesController();
            IActionResult ar = ac.Post(
                new TokenRequest(token));
            OkObjectResult res = (OkObjectResult)ar;
            Response r = (Response)res.Value;
            Assert.AreEqual(r.error, "");
            LobbiesResponse lr = (LobbiesResponse)r.payload;

            ar = ac.Post(
                new TokenRequest("321123"));
            res = (OkObjectResult)ar;
            r = (Response)res.Value;
            Assert.AreEqual(r.error, "Неавторизованный пользователь");
        }

        [TestMethod]
        public void NewLobbyTest()
        {
            string token = TokenManager.RegisterUserToken(123, "s");
            LobbiesController ac = new LobbiesController();
            IActionResult ar = ac.Post(
                new TokenRequest("321123"));
            OkObjectResult res = (OkObjectResult)ar;
            Response r = (Response)res.Value;
            Assert.AreEqual(r.error, "Неавторизованный пользователь");
        }
    }
}
