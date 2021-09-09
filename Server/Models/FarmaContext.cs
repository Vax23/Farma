using Microsoft.EntityFrameworkCore;

namespace Server.Models
{
    public class FarmaContext : DbContext
    {
        public DbSet<Farma> Farme { get; set; }
        public DbSet<Inventar> Inventari { get; set; }
        public DbSet<Proizvod> Proizvodi { get; set; }

        public FarmaContext(DbContextOptions options) : base(options)
        {

        }
    }
}