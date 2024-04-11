namespace WebApplication1.Controllers
{
    public class Class
    {
        public static class PasswordStrengthChecker
        {
            public static bool IsPasswordStrong(string password)
            {
                if (password.Length < 8) return false;
                if (!password.Any(char.IsUpper)) return false;
                if (!password.Any(char.IsLower)) return false;
                if (!password.Any(char.IsDigit)) return false;
                if (!password.Any(ch => !char.IsLetterOrDigit(ch))) return false;

                return true;
            }
        }
    }
}
