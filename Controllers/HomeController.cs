using System;
using System.IO;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyNdMap.Models;
using System.Web;
using Microsoft.AspNetCore.Http;

namespace MyNdMap.Controllers
{
    public class HomeController : Controller
    {
        private MyContext dbContext;

        public HomeController(MyContext context)
        {
            dbContext = context;
        }

        public IActionResult Index()
        {
            DirectoryInfo directoryInfo = new DirectoryInfo("wwwroot/maps/");
            FileInfo[] Files = directoryInfo.GetFiles("*");
            Console.Write(Files);
            ViewBag.AllFiles = Files;
            return View();
        }

        [HttpPost("/saveMap")]
        public void SaveMap(string allTheStuff)
        {   
            var randomFileName = Path.GetRandomFileName();
            
            var filepath = "wwwroot/maps/" + randomFileName;

            StreamWriter file = new StreamWriter(filepath);
            file.WriteLine(allTheStuff);
            file.Close();
        }

        [HttpPost("/getMap")]
        public string LoadMap(string filePath)
        {
            string readText = System.IO.File.ReadAllText(filePath);
            // string readText = System.IO.File.ReadAllText("wwwroot/maps/grzc02i4.3sb");
            Console.WriteLine(readText);
            return readText;
        }
    }
}
