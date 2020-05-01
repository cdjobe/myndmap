using Microsoft.EntityFrameworkCore;

namespace MyNdMap.Models
{
    public class MyContext : DbContext
    {
        public MyContext (DbContextOptions options): base(options) {}
        public DbSet<User> Users {get;set;}
        public DbSet<File> Files {get;set;}
    }
}