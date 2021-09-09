using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    [Table("Farma")]
    public class Farma
    {
        [Key]
        [Column("ID")]
        public int ID { get; set; }

        [Column("Naziv")]
        [MaxLength(80)]
        public string Naziv { get; set; }

        [Column("Adresa")]
        [MaxLength(500)]
        public string Adresa { get; set; }

        [Column("Broj")]
        [MaxLength(50)]
        public string Broj { get; set; }

        [Column("Email")]
        [MaxLength(100)]
        public string Email { get; set; }

        

        public virtual List<Inventar> Inventari { get; set; }

    }
}