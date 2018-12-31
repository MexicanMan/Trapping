using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using System;
using System.Threading;

namespace Tests
{
    public class SeleniumTests
    {
        IWebDriver driver;

        [SetUp]
        public void Setup()
        {
            driver = new ChromeDriver("./");
            driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(5);
            Console.WriteLine("Created driver");
        }

        // 14
        [Test]
        public void TestGoReg()
        {
            driver.Navigate().GoToUrl("http://192.168.169.223:51510/");

            // Get the page elements
            IWebElement regButton = driver.FindElement(By.XPath("//button[.='Register']"));

            regButton.Click();
            IWebElement header = driver.FindElement(By.XPath("//h3"));

            Assert.AreEqual(header.Text, "DirtyGame | Registration");
        }

        // 13
        [Test]
        public void TestGoCreateLobby()
        {
            driver.Navigate().GoToUrl("http://192.168.169.223:51510/");

            IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
            js.ExecuteScript("sessionStorage.setItem('token', 1);");

            driver.Navigate().GoToUrl("http://192.168.169.223:51510/lobbies");

            Thread.Sleep(500);
            IWebElement okButton = driver.FindElement(By.XPath("//button[.='OK']"));
            okButton.Click();

            // Get the page elements
            Thread.Sleep(500);
            IWebElement newButton = driver.FindElement(By.XPath("//button[.='Create new lobby']"));

            newButton.Click();
            IWebElement header = driver.FindElement(By.XPath("//h3"));

            Assert.AreEqual(header.Text, "DirtyGame | Create new lobby");
        }

        // 15
        [Test]
        public void TestLobbiesUnauth()
        {
            driver.Navigate().GoToUrl("http://192.168.169.223:51510/");

            IJavaScriptExecutor js = (IJavaScriptExecutor) driver;
            js.ExecuteScript("sessionStorage.setItem('token', 1);");

            driver.Navigate().GoToUrl("http://192.168.169.223:51510/lobbies");

            // Get the page elements
            Thread.Sleep(500);
            IWebElement errorMsg = driver.FindElement(By.ClassName("modal-body"));

            Assert.AreEqual(errorMsg.Text, "Неавторизованный пользователь");
        }

        // 12
        [Test]
        public void TestPrivateRoutes()
        {
            driver.Navigate().GoToUrl("http://192.168.169.223:51510/lobbies");

            Thread.Sleep(1000);
            Assert.AreEqual(driver.Url, "http://192.168.169.223:51510/auth");
        }

        // 16
        [Test]
        public void TestPasswordsNotMatch()
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
            passwordConfField.SendKeys("12");

            regButton.Click();

            Thread.Sleep(1000);
            IWebElement errorMsg = driver.FindElements(By.ClassName("invalid-feedback"))[1];
            Assert.AreEqual(errorMsg.Text, "Passwords do not match!");
        }

        // 11
        [Test]
        public void TestAlreadyAuthRoutes()
        {
            driver.Navigate().GoToUrl("http://192.168.169.223:51510/");

            IJavaScriptExecutor js = (IJavaScriptExecutor) driver;
            js.ExecuteScript("sessionStorage.setItem('token', 1);");

            driver.Navigate().GoToUrl("http://192.168.169.223:51510/auth");

            Thread.Sleep(1000);
            Assert.AreEqual(driver.Url, "http://192.168.169.223:51510/lobbies");
        }

        [TearDown]
        public void CleanUp()
        {
            driver.Close();
            Console.WriteLine("Closed the browser");
        }
    }
}