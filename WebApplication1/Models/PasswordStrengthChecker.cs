using System.Linq;

namespace WebApplication1.Models
{
    public static class PasswordStrengthChecker
    {
        public static bool IsPasswordStrong(string password)
        {
            // Sprawdzenie długości hasła
            if (password == null || password.Length < 8)
                return false;

            // Sprawdzenie czy hasło zawiera co najmniej jedną dużą literę
            if (!password.Any(char.IsUpper))
                return false;

            // Sprawdzenie czy hasło zawiera co najmniej jedną małą literę
            if (!password.Any(char.IsLower))
                return false;

            // Sprawdzenie czy hasło zawiera co najmniej jedną cyfrę
            if (!password.Any(char.IsDigit))
                return false;

            // Sprawdzenie czy hasło zawiera co najmniej jeden znak specjalny
            if (!password.Any(ch => !char.IsLetterOrDigit(ch)))
                return false;

            return true;
        }
    }
}
