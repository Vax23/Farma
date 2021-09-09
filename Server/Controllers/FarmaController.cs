using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.Models;

namespace Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FarmaController : ControllerBase
    {
        public FarmaContext Context { get; set; }

        public FarmaController(FarmaContext context)
        {
            Context = context;
        }

        [Route("PreuzmiFarme")]
        [HttpGet]
        public async Task<List<Farma>> PreuzmiFarme()
        {
            return await Context.Farme.Include(p => p.Inventari).ToListAsync();
        }

        [Route("PreuzmiInventare/{idFarme}")]
        [HttpGet]
        public async Task<List<Inventar>> PreuzmiInventare(int idFarme)
        {
            return await Context.Inventari.Where(inventar => inventar.Farma.ID == idFarme).Include(inv => inv.Proizvodi).ToListAsync();
        }

        [Route("PreuzmiProizvode")]
        [HttpGet]
        public async Task<List<Proizvod>> PreuzmiProizvode()
        {
            return await Context.Proizvodi.ToListAsync();

        }

        [HttpPost]
        [Route("UpisiFarmu")]
        public async Task UpisiFarmu(Farma farma)
        {
           Context.Farme.Add(farma);
            await Context.SaveChangesAsync();
        }

        [Route("UpisiInventar/{idFarme}")]
        [HttpPost]
        public async Task<IActionResult> UpisiInventar(int idFarme, [FromBody] Inventar inventar)
        {
            var far = await Context.Farme.FindAsync(idFarme);
            inventar.Farma = far;
            var inv = Context.Inventari.Where(o => o.Naziv == inventar.Naziv).FirstOrDefault();
            if (inv != null)
            {
                return StatusCode(406);
            }
            else if (inventar.BrojRedova < 1 || inventar.BrojKolona < 1)
            {
                return StatusCode(407);
            }
            else
            {
                Context.Inventari.Add(inventar);
                await Context.SaveChangesAsync();
                return Ok();
            }
        }

        [Route("UpisiProizvod/{idInventara}")]
        [HttpPost]
        public async Task<IActionResult> UpisiProizvod(int idInventara, [FromBody] Proizvod proizvod)
        {
            var inv = await Context.Inventari.FindAsync(idInventara);
            proizvod.Inventar = inv;
            if (Context.Proizvodi.Any(p => p.Naziv == proizvod.Naziv && (p.Red != proizvod.Red || p.Kolona != proizvod.Kolona)))
            {
                var xy = Context.Proizvodi.Where(p => p.Naziv == proizvod.Naziv).FirstOrDefault();
                return BadRequest(new { X = xy?.Red, Y = xy?.Kolona });//proizvod postoji na drugoj lokaciji
            }
            var pozicija = Context.Proizvodi.Where(p => p.Inventar.ID == idInventara && p.Red == proizvod.Red && p.Kolona == proizvod.Kolona).FirstOrDefault();

            if (pozicija != null)
            {
                if (pozicija.Naziv != proizvod.Naziv)
                {
                    return StatusCode(406);//na ovoj lokaciji je drugi proizvod, probajte na nekoj drugoj
                }
                else
                {
                    return StatusCode(407);//ovde je taj proizvod, mozete da azurirate kolicinu
                }
            }

            if (proizvod.Kolicina < 1)
                return StatusCode(410);

            Context.Proizvodi.Add(proizvod);
            await Context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut]
        [Route("IzmeniFarmu")]
        public async Task IzmeniFarmu(Farma farma)
        {
            Context.Farme.Update(farma);
            await Context.SaveChangesAsync();
        }

        [Route("IzmeniInventar/{idFarme}")]
        [HttpPut]
        public async Task<IActionResult> IzmeniInventar(int idFarme, [FromBody] Inventar inventar)
        {

            var k = Context.Inventari.Where(p => p.Farma.ID == idFarme && p.Naziv == inventar.Naziv).FirstOrDefault();
            if (k != null)
            {
                k.BrojRedova = inventar.BrojRedova;
                k.BrojKolona = inventar.BrojKolona;
                Context.Update<Inventar>(k);
                await Context.SaveChangesAsync();
                return Ok();
            }
            else
                return StatusCode(404);
        }

        [Route("IzmeniProizvod/{idInventara}")]
        [HttpPut]
        public async Task<IActionResult> IzmeniProizvod(int idInventara, [FromBody] Proizvod proizvod)
        {
            if (proizvod.Kolicina < 1)
            {
                return StatusCode(406);
            }
            var k = Context.Proizvodi.Where(p => p.Inventar.ID == idInventara && p.Red == proizvod.Red && p.Kolona == proizvod.Kolona).FirstOrDefault();
            if (k != null)
            {
                k.Kolicina = proizvod.Kolicina;
                Context.Update<Proizvod>(k);
                await Context.SaveChangesAsync();
                return Ok();
            }
            else
                return StatusCode(404);
        }

        [HttpDelete]
        [Route("ObrisiFarmu/{id}")]
        public async Task ObrisiFarmu(int id)
        {
            
            var farma=await Context.Farme.FindAsync(id);
            var inv=await Context.Inventari.Where(x=>x.Farma==farma).ToListAsync();
            inv.ForEach(inventar=>{

            var pro= Context.Proizvodi.Where(x=>x.Inventar==inventar).ToList();
            pro.ForEach(proizvod=>{
                Context.Proizvodi.Remove(proizvod);
            });

                Context.Inventari.Remove(inventar);
            });
            Context.Farme.Remove(farma);
            await Context.SaveChangesAsync();
        }

        [Route("ObrisiInventar/{idFarme}")]
        [HttpDelete]
        public async Task<IActionResult> ObrisiInventar(int idFarme, [FromBody] Inventar inventar)
        {
            var i = Context.Inventari.Where(p => p.Farma.ID == idFarme && p.Naziv == inventar.Naziv).FirstOrDefault();
            if (i != null)
            {
                
            var pro=await Context.Proizvodi.Where(x=>x.Inventar==i).ToListAsync();
            pro.ForEach(proizvod=>{
                Context.Proizvodi.Remove(proizvod);
            });
                Context.Inventari.Remove(i);
                await Context.SaveChangesAsync();
                return Ok();
            }
            else
                return StatusCode(404);
        }

        [Route("ObrisiProizvod/{idInventara}")]
        [HttpDelete]
        public async Task<IActionResult> ObrisiProizvod(int idInventara, [FromBody] Proizvod proizvod)
        {
            var k = Context.Proizvodi.Where(p => p.Inventar.ID == idInventara && p.Red == proizvod.Red && p.Kolona == proizvod.Kolona).FirstOrDefault();
            if (k != null)
            {
               
                Context.Proizvodi.Remove(k);
                await Context.SaveChangesAsync();
                return Ok();
            }
            else
                return StatusCode(404);
        }
    }
}
