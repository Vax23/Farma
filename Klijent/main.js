import { Farma } from "./farma.js"

fetch("https://localhost:5001/Farma/PreuzmiFarme").then(p => {
    p.json().then(data => {
        data.forEach(farma => {
            const f = new Farma(farma.id, farma.naziv, farma.adresa, farma.broj, farma.email);
            f.crtajFarmu(document.body);
        })
        //console.log(data);
    });
});