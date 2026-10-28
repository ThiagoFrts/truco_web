const mycards = window.document.getElementById("minhascartas");
const cpucards = window.document.getElementById("cartascomputador");

for (let i = 0; i < jogadores[0].cartas.length; i++) {
    const imagem = document.createElement("img");
    imagem.src = jogadores[0].cartas[i].imagem;
    mycards.appendChild(imagem)
}

for (let i = 0; i < jogadores[0].cartas.length; i++) {
    const imagem = document.createElement("img");
    imagem.src = "../assets/cards/svg/verso.svg"
    cpucards.appendChild(imagem);
}

console.log(jogadores[1].cartas);
console.log(jogadores[0].cartas);