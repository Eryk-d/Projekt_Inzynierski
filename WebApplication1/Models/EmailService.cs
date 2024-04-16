using MailKit.Net.Smtp;
using MimeKit;

public class EmailService
{
    public async Task SendEmailAsync(string toEmail, string subject, string message)
    {
        var emailMessage = new MimeMessage();

        emailMessage.From.Add(new MailboxAddress("inz", "eroero3201@onet.pl"));
        emailMessage.To.Add(new MailboxAddress("opis", toEmail));
        emailMessage.Subject = subject;
        emailMessage.Body = new TextPart("html") { Text = message };

        using (var client = new SmtpClient())
        {
            // Jeśli używasz Gmaila, port to 587 lub 465, i serwer to smtp.gmail.com
            await client.ConnectAsync("smtp.poczta.onet.pl", 587, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync("eroero3201@onet.pl", "1XDI-2QHS-Z8O7-V8H3");
            await client.SendAsync(emailMessage);
            await client.DisconnectAsync(true);
        }
    }
}
