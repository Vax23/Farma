using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Server.Models
{
    [Table("Inventar")]
    public class Inventar
    {
        [Key]
        [Column("ID")]
        public int ID { get; set; }

        [Column("Naziv")]
        public string Naziv { get; set; }

        [Column("BrojRedova")]
        public int BrojRedova { get; set; }

        [Column("BrojKolona")]
        public int BrojKolona { get; set; }

        public virtual List<Proizvod> Proizvodi { get; set; }

        [JsonIgnore]
        public Farma Farma { get; set; }

    }
}