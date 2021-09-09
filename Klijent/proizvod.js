export class Proizvod {

    constructor(id, naziv, cena, kolicina, red, kolona) {
        this.id = id;
        this.naziv = naziv;
        this.cena = cena;
        this.kolicina = kolicina;
        this.red = red;
        this.kolona = kolona;
        this.miniKontejner = null;
    }

    crtajProizvod(host) {
        this.miniKontejner = document.createElement("div");
        this.miniKontejner.className = "proizvod";
        this.miniKontejner.innerHTML = "Prazno!";
        host.appendChild(this.miniKontejner);
    }

    dugmeInfo() {
        const dugmeInfo = document.createElement("button");
        dugmeInfo.innerHTML = "Prikazi informacije!";
        dugmeInfo.className = "dugme";
        this.miniKontejner.appendChild(dugmeInfo);

        dugmeInfo.onclick = (ev) => {
            fetch("https://localhost:5001/Farma/PreuzmiProizvode").then(p => {
                p.json().then(proizvodi => {
                    proizvodi.forEach(p => {
                        if (p.naziv == this.naziv) {
                            const info = `Naziv proizvoda: ${p.naziv}\n Cena proizvoda: ${p.cena}\n Kolicina proizvoda: ${p.kolicina} `;
                            alert(info);
                        }
                    })
                });
            });
        }
    }

    info() {
        this.miniKontejner.innerHTML = "";
        let naziv = document.createElement("label");
        naziv.innerHTML = this.naziv;
        naziv.className = "naziv";
        this.miniKontejner.appendChild(naziv);
    }

    dodajUInventar(id, naziv, cena, kolicina, red, kolona) {
        this.id = id;
        this.naziv = naziv;
        this.cena = cena;
        this.kolicina = kolicina;
        this.red = red;
        this.kolona = kolona;
        this.miniKontejner.style.backgroundColor = "rgb(152,251,152)"; //boja zelena
        this.info();
        this.dugmeInfo();
    }

    azurirajKolicinu(novaKolicina) {
        this.kolicina = novaKolicina;
        this.miniKontejner.style.backgroundColor = "rgb(152,251,152)"; //boja zelena
        this.info();
        this.dugmeInfo();
    }

    obrisi() {
        this.naziv = " ";
        this.cena = 0;
        this.kolicina = 0;
        this.miniKontejner.style.backgroundColor = "rgb(250,235,215)"; //boja antiquewhite
        this.miniKontejner.innerHTML = "Prazno!";
    }
}