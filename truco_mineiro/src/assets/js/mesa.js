const mycards = window.document.getElementById("minhascartas");
const centro = window.document.querySelector(".centro");
const cpucards = window.document.getElementById("cartascomputador");
let jogar = true;
const botcartas = [];

for (let i = 0; i < jogadores[0].cartas.length; i++) {
    const imagem = document.createElement("img");
    imagem.src = jogadores[0].cartas[i].imagem;
    mycards.appendChild(imagem);

    imagem.addEventListener("click", function () {
        if (!jogar) {
            return;
        }
        centro.appendChild(imagem);
        jogar = false;
        botcartas[i].src = jogadores[1].cartas[i].imagem;
        centro.appendChild(botcartas[i]);

    })
}

for (let i = 0; i < jogadores[0].cartas.length; i++) {
    const imagem = document.createElement("img");
    imagem.src = "../assets/cards/svg/verso.svg"
    cpucards.appendChild(imagem);
    botcartas.push(imagem)

}

console.log(jogadores[0].cartas);
console.log(jogadores[1].cartas);

