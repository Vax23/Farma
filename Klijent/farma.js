import { Inventar } from "./inventar.js";
import { Proizvod } from "./proizvod.js";

export class Farma {

    constructor(id, naziv, adresa, broj, email) {
        this.id = id;
        this.naziv = naziv;
        this.adresa=adresa;
        this.broj=broj;
        this.email=email;
        this.inventari = [];
        this.kontejner = null;
    }

    dodajInventar(i) {
        this.inventari.push(i);
    }

    crtajFarmu(host) {
        if (!host)
            throw new Exception("Roditeljski element ne postoji");

        this.kontejner = document.createElement("div");
        this.kontejner.classList.add("kontFarma");
        host.appendChild(this.kontejner);

        let info = document.createElement("label");
        info.className = "info";
        info.innerHTML = `${this.naziv}`;
        this.kontejner.appendChild(info);

        const gornjiDiv = document.createElement("div");
        gornjiDiv.className = "gornjiDiv";
        this.kontejner.appendChild(gornjiDiv);

        this.informacije(gornjiDiv);
        this.formaZaInventar(gornjiDiv);

        fetch("https://localhost:5001/Farma/PreuzmiInventare/" + this.id).then(p => {
            p.json().then(data => {
                data.forEach(inv => {
                    const inventar = new Inventar(inv.id, inv.naziv, inv.brojRedova, inv.brojKolona);
                    this.dodajInventar(inventar);
                    inventar.crtajInventar(this.kontejner);
                    inv.proizvodi.forEach(proizvod => {
                        inventar.proizvodi[(proizvod.red - 1) * inventar.brKolona + proizvod.kolona - 1].dodajUInventar(proizvod.id, proizvod.naziv, proizvod.cena, proizvod.kolicina, proizvod.red, proizvod.kolona)
                    });
                });
            });
        });
    }



    informacije(host) {

        const forma = document.createElement("div");
        host.appendChild(forma);
        //forma.className = "formaInventar";

        forma.classList.add("inventarForme");
        forma.classList.add("miniInvForme");

        let labele = ["Naziv:", "Adresa:", "Broj telefona:", "Email:"];
        labele.className = "labele";
        let tipovi = [this.naziv, this.adresa, this.broj, this.email];
        let polje = null;

        let labela = document.createElement("label");
        labela.innerHTML = "Informacije o farmi";
        labela.className = "nazivForme";
        forma.appendChild(labela);

        labele.forEach((el, ind) => {
            labela = document.createElement("h3");
            labela.innerHTML = el;
            forma.appendChild(labela);
            polje = document.createElement("label");
            polje.innerHTML = tipovi[ind];
            forma.appendChild(polje);
        })
    }

    formaZaInventar(host) { 

        const forma = document.createElement("div");
        host.appendChild(forma);
        //forma.className = "formaInventar";

        forma.classList.add("inventarForme");
        forma.classList.add("miniInvForme");

        let labele = ["Naziv:", "Broj redova:", "Broj kolona:"];
        labele.className = "labele";
        let tipovi = ["text", "number", "number"];
        let klase = ["naziv", "brRedova", "brKolona"];
        let polje = null;

        let labela = document.createElement("label");
        labela.innerHTML = "Unos novog inventara";
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

        polje = document.createElement("button");
        polje.className = "dugme";
        polje.innerHTML = "Dodaj";
        forma.appendChild(polje);

        polje.onclick = (ev) => {
            const naziv = forma.querySelector(".naziv").value;
            const brRedova = parseInt(forma.querySelector(".brRedova").value);
            const brKolona = parseInt(forma.querySelector(".brKolona").value);
            const id = this.id;

            if (naziv == "")
                alert("Morate da unesete naziv inventara.");
            else if (isNaN(brRedova))
                alert("Morate da unesete broj redova.");
            else if (isNaN(brKolona))
                alert("Morate da unesete broj kolona.");
            else {
                fetch("https://localhost:5001/Farma/UpisiInventar/" + this.id, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        naziv: naziv,
                        brojRedova: brRedova,
                        brojKolona: brKolona
                    })
                }).then(p => {
                    if (p.ok) {
                        const inv = new Inventar(this.inventari.length, naziv, brRedova, brKolona);
                        console.log(this.inventari);
                        this.dodajInventar(inv);
                        inv.crtajInventar(this.kontejner);
                        alert("Inventar je uspesno dodat!");
                    }
                    else if (p.status == 406) {
                        alert("Već postoji ovaj inventar.");
                    }
                    else if (p.status == 407) {
                        alert("Inventar mora imati bar jedan red i bar jednu kolonu.");
                    }
                });

            }
        }
    }



    
}