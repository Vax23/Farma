import { Proizvod } from "./proizvod.js";

export class Inventar {
    constructor(id, naziv, brRedova, brKolona) {
        this.id = id;
        this.naziv = naziv;
        this.brRedova = brRedova;
        this.brKolona = brKolona;
        this.proizvodi = [];
        this.kontejner = null;
    }

    dodajProizvod(p) {
        this.proizvodi.push(p);
    }

    crtajInventar(host) {
        if (!host)
            throw new Exception("Roditeljski element ne postoji");

        let info = document.createElement("label");
        info.classList.add("info");
        info.innerHTML = this.naziv;
        host.appendChild(info);

        this.kontejner = document.createElement("div");
        this.kontejner.classList.add("kontInventar");
        host.appendChild(this.kontejner);

        const divZaForme = document.createElement("div");
        divZaForme.className = "inventarForme";
        this.kontejner.appendChild(divZaForme);

        this.formaDodaj(divZaForme);
        this.formaAzuriraj(divZaForme);
        this.formaBrisi(divZaForme);

        const divZaCrtanje = document.createElement("div");
        divZaCrtanje.className = "divZaCrtanje";
        this.kontejner.appendChild(divZaCrtanje);
        this.crtajLokacije(divZaCrtanje);
    }

    formaDodaj(host) {

        const forma = document.createElement("div");
        host.appendChild(forma);

        forma.classList.add("inventarForme");
        forma.classList.add("miniInvForme");

        let labele = ["Naziv:", "Cena", "Količina:"];
        labele.className = "labele";
        let tipovi = ["text", "number", "number"];
        let klase = ["naziv", "cena", "kol"];
        let polje = null;

        let labela = document.createElement("label");
        labela.innerHTML = "Unos proizvoda";
        labela.className = "nazivForme";
        forma.appendChild(labela);

        labele.forEach((el, ind) => {
            labela = document.createElement("label");
            labela.innerHTML = el;
            forma.appendChild(labela);
            polje = document.createElement("input");
            polje.type = tipovi[ind];
            polje.className = klase[ind];
            forma.appendChild(polje);
        })

        let koordinate = ["Red:", "Kolona:"];
        let vrednosti = [this.brRedova, this.brKolona];
        klase = ["X", "Y"];
        let kord = document.createElement("div");
        let el = null;
        forma.appendChild(kord);

        koordinate.forEach((e, ind) => {
            el = document.createElement("label");
            el.innerHTML = e;
            kord.appendChild(el);
            let sel = document.createElement("select");
            sel.className = klase[ind];
            kord.appendChild(sel);
            for (let i = 1; i <= vrednosti[ind]; i++) {
                el = document.createElement("option");
                el.innerHTML = i;
                el.value = i;
                sel.appendChild(el);
            }
        })

        polje = document.createElement("button");
        polje.className = "dugme";
        polje.innerHTML = "Dodaj";
        forma.appendChild(polje);

        polje.onclick = (ev) => {

            const naziv = forma.querySelector(".naziv").value;
            const cena = parseInt(forma.querySelector(".cena").value);
            const kolicina = parseInt(forma.querySelector(".kol").value);
            const x = parseInt(forma.querySelector(".X").value);
            const y = parseInt(forma.querySelector(".Y").value);

            if (naziv == "")
                alert("Morate da unesete naziv proizvoda.");
            else if (isNaN(cena))
                alert("Morate da unesete cenu.");
            else if (isNaN(kolicina))
                alert("Morate da unesete količinu.");
            else {
                fetch("https://localhost:5001/Farma/UpisiProizvod/" + this.id, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        naziv: naziv,
                        cena: cena,
                        kolicina: kolicina,
                        red: x,
                        kolona: y
                    })
                }).then(p => {
                    if (p.ok) {
                        this.proizvodi[(x - 1) * this.brKolona + y - 1].dodajUInventar(0, naziv, cena, kolicina, x, y);
                        alert("Proizvod je uspesno dodat!");
                    }
                    else if (p.status == 400) {
                        const greskaLokacija = { x: 0, y: 0 };
                        p.json().then(q => {
                            greskaLokacija.x = q.x;
                            greskaLokacija.y = q.y;
                            alert("Ovaj proizvod već postoji u " + greskaLokacija.x + ". redu, u " + greskaLokacija.y + ". koloni.");
                        });
                    }
                    else if (p.status === 406) {
                        alert("Na ovoj lokaciji se već nalazi neki drugi proizvod.\nProbajte da dodate proizvod na drugu lokaciju.");
                    }
                    else if (p.status === 407) {
                        alert("Proizvod je već na ovoj lokaciji.\nAžurirajte količinu ako želite.");
                    }
                    else if (p.status === 410) {
                        alert("Morate dodati bar jedan proizvod.");
                    }
                    else
                        alert("greska");
                });
            }
            //console.log(this.proizvodi);            
        }
    }

    formaAzuriraj(host) {
        const formaIzmeni = document.createElement("div");
        host.appendChild(formaIzmeni);

        formaIzmeni.classList.add("inventarForme");
        formaIzmeni.classList.add("miniInvForme");

        let labelaI = document.createElement("label");
        labelaI.innerHTML = "Ažuriranje";
        labelaI.className = "nazivForme";
        formaIzmeni.appendChild(labelaI);

        let koordinateI = ["Red:", "Kolona:"];
        let vrednostiI = [this.brRedova, this.brKolona];
        let klaseI = ["xI", "yI"];
        let kord = document.createElement("div");
        let el = null;
        formaIzmeni.appendChild(kord);

        koordinateI.forEach((e, ind) => {
            el = document.createElement("label");
            el.innerHTML = e;
            kord.appendChild(el);
            let sel = document.createElement("select");
            sel.className = klaseI[ind];
            kord.appendChild(sel);
            for (let i = 1; i <= vrednostiI[ind]; i++) {
                el = document.createElement("option");
                el.innerHTML = i;
                el.value = i;
                sel.appendChild(el);
            }
        })

        let el2 = document.createElement("label");
        el2.innerHTML = "Nova količina:";
        formaIzmeni.appendChild(el2);

        el = document.createElement("input");
        el.type = "number";
        el.className = "novaKol";
        formaIzmeni.appendChild(el);

        const d = document.createElement("button");
        d.className = "dugme";
        d.innerHTML = "Ažuriraj";
        formaIzmeni.appendChild(d);

        d.onclick = (ev) => {

            const x = parseInt(formaIzmeni.querySelector(".xI").value);
            const y = parseInt(formaIzmeni.querySelector(".yI").value);
            const novaKolicina = parseInt(formaIzmeni.querySelector(".novaKol").value);

            if (isNaN(novaKolicina)) {
                alert("Niste uneli novu količinu!");
                return;
            }

            fetch("https://localhost:5001/Farma/IzmeniProizvod/" + this.id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    kolicina: novaKolicina,
                    red: x,
                    kolona: y
                })
            }).then(p => {
                if (p.ok) {
                    this.proizvodi[(x - 1) * this.brKolona + y - 1].azurirajKolicinu(novaKolicina);
                    alert("Proizvod je uspesno azuriran!");
                }
                else if (p.status == 404) {
                    alert("Na ovoj lokaciji ne postoji nijedan proizvod.");
                }
                else if (p.status == 406) {
                    alert("Nova količina mora da bude bar 1.");
                }
            });
        }
    }

    formaBrisi(host) {

        const formaIzmeni = document.createElement("div");
        host.appendChild(formaIzmeni);

        formaIzmeni.classList.add("inventarForme");
        formaIzmeni.classList.add("miniInvForme");

        let labelaI = document.createElement("label");
        labelaI.innerHTML = "Brisanje";
        labelaI.className = "nazivForme";
        formaIzmeni.appendChild(labelaI);

        let koordinateI = ["Red:", "Kolona:"];
        let vrednostiI = [this.brRedova, this.brKolona];
        let klaseI = ["xI", "yI"];
        let kord = document.createElement("div");
        let el = null;
        formaIzmeni.appendChild(kord);

        koordinateI.forEach((e, ind) => {
            el = document.createElement("label");
            el.innerHTML = e;
            kord.appendChild(el);
            let sel = document.createElement("select");
            sel.className = klaseI[ind];
            kord.appendChild(sel);
            for (let i = 1; i <= vrednostiI[ind]; i++) {
                el = document.createElement("option");
                el.innerHTML = i;
                el.value = i;
                sel.appendChild(el);
            }
        })

        const d = document.createElement("button");
        d.className = "dugme";
        d.innerHTML = "Obriši";
        formaIzmeni.appendChild(d);

        d.onclick = (ev) => {
            const x = parseInt(formaIzmeni.querySelector(".xI").value);
            const y = parseInt(formaIzmeni.querySelector(".yI").value);


            fetch("https://localhost:5001/Farma/ObrisiProizvod/" + this.id, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    red: x,
                    kolona: y
                })
            }).then(p => {
                if (p.ok) {
                    this.proizvodi[(x - 1) * this.brKolona + y - 1].obrisi();
                    alert("Proizvod je uspesno obrisan!");
                }
                else if (p.status == 404) {
                    alert("Na ovoj lokaciji ne postoji nijedan proizvod.");
                }
            });
            //console.log(this.proizvodi);
        }
    }

    crtajLokacije(host) {
        let red = null;
        for (let i = 0; i < this.brRedova; i++) {
            red = document.createElement("div");
            host.appendChild(red);
            red.className = "red";
            for (let j = 0; j < this.brKolona; j++) {
                this.dodajProizvod(new Proizvod(0, " ", 0, 0, i + 1, j + 1));
                this.proizvodi[i * this.brKolona + j].crtajProizvod(red);
            }
        }
    }

    azurirajRedKolone(noviRed, novaKolona) {
        this.brRedova=noviRed;
        this.brKolona=novaKolona;
    }

    obrisi() {
        this.naziv = " ";
        this.brRedova = 0;
        this.brKolona = 0;
    }

    vratiId(naziv){

        if(this.naziv==naziv)
            return this.id;

    }

    
}