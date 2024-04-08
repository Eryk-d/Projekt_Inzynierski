using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Contact()
        {
            return View();
        }

        public IActionResult Zaloguj()
        {
            return View();
        }

        public IActionResult Zarejestruj()
        {
            return View();
        }

        public IActionResult Generuj()
        {
            return View();
        }

        public IActionResult Index2()
        {
            return View();
        }
        public IActionResult Security()
        {
            return View();
        }

        public IActionResult ContactNIE()
        {
            return View();
        }

        public IActionResult SecurityNIE()
        {
            return View();
        }
        public IActionResult GenerujNIE()
        {
            return View();
        }

        public IActionResult Dodaj_haslo()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}