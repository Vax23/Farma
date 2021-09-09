using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Server.Models
{
    [Table("Proizvod")]
    public class Proizvod
    {
        [Key]
        [Column("ID")]
        public int ID { get; set; }

        [Column("Naziv ")]
        [MaxLength(100)]
        public string Naziv { get; set; }

        [Column("Cena")]
        public int Cena { get; set; }

        [Column("Kolicina")]
        public int Kolicina { get; set; }

        [Column("Red")]
        public int Red { get; set; }

        [Column("Kolona")]
        public int Kolona { get; set; }

        [JsonIgnore]
        public Inventar Inventar { get; set; }

    }
}