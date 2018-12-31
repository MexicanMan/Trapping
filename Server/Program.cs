using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using ProjectAstolfo.Model;
using System;

namespace Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                //.UseUrls(urls: "http://159.65.120.109:80/")
                .UseUrls(urls: "http://192.168.169.223:51510/")
                //.UseUrls(urls: "http://26.11.117.175:25565")
                .Build();
    }
}
