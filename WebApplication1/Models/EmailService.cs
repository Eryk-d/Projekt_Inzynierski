using MailKit.Net.Smtp;
using MimeKit;

public class EmailService
{
    public async Task SendEmailAsync(string toEmail, string subject, string message)
    {
        var emailMessage = new MimeMessage();

        emailMessage.From.Add(new MailboxAddress("Twoje Imię lub Nazwa Firmy", "twoj-email@domena.com"));
        emailMessage.To.Add(new MailboxAddress("", toEmail));
        emailMessage.Subject = subject;
        emailMessage.Body = new TextPart("html") { Text = message };

        using (var client = new SmtpClient())
        {
            // Jeśli używasz Gmaila, port to 587 lub 465, i serwer to smtp.gmail.com
            await client.ConnectAsync("smtp.twojserwer.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync("twoj-email@domena.com", "twojeHaslo");
            await client.SendAsync(emailMessage);
            await client.DisconnectAsync(true);
        }
    }
}
