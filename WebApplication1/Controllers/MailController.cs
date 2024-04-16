using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebApplication1.Controllers
{
    public class MailController : Controller
    {
        private readonly EmailService _emailService;

        public MailController(EmailService emailService)
        {
            _emailService = emailService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> SendEmail(string name, string email, string message)
        {
            try
            {
                string subject = "Wiadomość od: " + name;  // Ustalenie tematu wiadomości
                await _emailService.SendEmailAsync(email, subject, message);
                TempData["Message"] = "Wiadomość została wysłana pomyślnie!";
            }
            catch (System.Exception ex)
            {
                TempData["Message"] = $"Błąd: {ex.Message}";
            }
            // Przekieruj do widoku Index w kontrolerze Home
            return RedirectToAction("Contact", "Home");
        }


    }
}
