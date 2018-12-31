using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using System;
using System.Threading;

namespace Tests
{
    public class Tests
    {
        IWebDriver driver;

        [SetUp]
        public void Setup()
        {
            driver = new ChromeDriver("./");
            driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(5);
            Console.WriteLine("Created driver");
        }

        // 18
        [Test]
        public void TestAuth()
        {
            driver.Navigate().GoToUrl("http://192.168.169.223:51510/");

            // Get the page elements
            IWebElement emailField = driver.FindElement(By.Id("email"));
            IWebElement passwordField = driver.FindElement(By.Id("pwd"));
            IWebElement loginButton = driver.FindElement(By.XPath("//button[@type='submit']"));

            // Type user name and password
            emailField.SendKeys("1@1");
            passwordField.SendKeys("1");

            // and click the login button
            loginButton.Click();

            Thread.Sleep(1000);
            Assert.AreEqual(driver.Url, "http://192.168.169.223:51510/lobbies");
        }

        // 17
        [Test]
        public void TestAlredyRegistered()
        {
            driver.Navigate().GoToUrl("http://192.168.169.223:51510/register");

            // Get the page elements
            IWebElement nickField = driver.FindElement(By.Id("nick"));
            IWebElement emailField = driver.FindElement(By.Id("email"));
            IWebElement passwordField = driver.FindElement(By.Id("pwd"));
            IWebElement passwordConfField = driver.FindElement(By.Id("pwdConf"));
            IWebElement regButton = driver.FindElement(By.XPath("//button[@type='submit']"));

            nickField.SendKeys("1");
            emailField.SendKeys("1@1");
            passwordField.SendKeys("1");
            passwordConfField.SendKeys("1");

            regButton.Click();

            Thread.Sleep(1000);
            IWebElement errorMsg = driver.FindElement(By.XPath("//div/span[@class='pl-1']"));
            Assert.AreEqual(errorMsg.Text, "Пользователь с таким именем уже зарегистрирован");
        }

        // 20
        [Test]
        public void TestAuthWrongPass()
        {
            driver.Navigate().GoToUrl("http://192.168.169.223:51510/");

            // Get the page elements
            IWebElement emailField = driver.FindElement(By.Id("email"));
            IWebElement passwordField = driver.FindElement(By.Id("pwd"));
            IWebElement loginButton = driver.FindElement(By.XPath("//button[@type='submit']"));

            // Type user name and password
            emailField.SendKeys("1@1");
            passwordField.SendKeys("2");

            // and click the login button
            loginButton.Click();
            IWebElement errorMsg = driver.FindElement(By.XPath("//div/span[@class='pl-1']"));

            Assert.AreEqual(errorMsg.Text, "Ошибка аутентификации");
        }

        // 19
        [Test]
        public void TestAuthWrongEmail()
        {
            driver.Navigate().GoToUrl("http://192.168.169.223:51510/");

            // Get the page elements
            IWebElement emailField = driver.FindElement(By.Id("email"));
            IWebElement passwordField = driver.FindElement(By.Id("pwd"));
            IWebElement loginButton = driver.FindElement(By.XPath("//button[@type='submit']"));

            // Type user name and password
            emailField.SendKeys("1@12");
            passwordField.SendKeys("1");

            // and click the login button
            loginButton.Click();
            IWebElement errorMsg = driver.FindElement(By.XPath("//div/span[@class='pl-1']"));

            Assert.AreEqual(errorMsg.Text, "Ошибка аутентификации");
        }

        // 21
        [Test]
        public void TestRefreshLobby()
        {
            bool isOk = false;

            TestAuth();

            // Get the page elements
            IWebElement refButton = driver.FindElement(By.Id("refreshBtn"));

            try
            {
                IWebElement errorModal = driver.FindElement(By.Id("errorModal"));
            }
            catch (Exception e)
            {
                isOk = true;
            }

            Assert.AreEqual(isOk, true);
        }

        [TearDown]
        public void CleanUp()
        {
            driver.Close();
            Console.WriteLine("Closed the browser");
        }
    }
}