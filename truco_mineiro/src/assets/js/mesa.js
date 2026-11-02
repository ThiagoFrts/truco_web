const mycards = window.document.getElementById("minhascartas");
const centro = window.document.querySelector(".centro");
const cpucards = window.document.getElementById("cartascomputador");
const botcartas = [];
const botOpt = [0, 1, 2];
let jogar = true;
let botRodada = 0;
let jogadorRodada = 0;

for (let i = 0; i < jogadores[0].cartas.length; i++) {
    const imagem = document.createElement("img");
    imagem.src = jogadores[0].cartas[i].imagem;
    mycards.appendChild(imagem);

    imagem.addEventListener("click", function () {
        if (!jogar) {
            return;
        }

        const posicao = Math.floor(Math.random() * botOpt.length);
        const escolhabot = botOpt[posicao];
        botOpt.splice(posicao, 1);

        console.log(escolhabot);
        centro.appendChild(imagem);
        jogar = false;
        botcartas[escolhabot].src = jogadores[1].cartas[escolhabot].imagem;
        centro.appendChild(botcartas[escolhabot]);

        const minhaCarta = jogadores[0].cartas[i];
        const botCarta = jogadores[1].cartas[escolhabot];
        const jogadorforca = forca(minhaCarta);
        const botforca = forca(botCarta);

        if (jogadorforca === botforca) {
            console.log("empate");
        }
        else if (jogadorforca > botforca) {
            console.log("Jogador ganhou");
            jogadorRodada += 1;
        }
        else {
            console.log("bot ganhou");
            botRodada += 1;
        }
        console.log(botRodada);
        console.log(jogadorRodada);

        setTimeout(function () {
            centro.replaceChildren();
            jogar = true;

        }, 2000)

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



