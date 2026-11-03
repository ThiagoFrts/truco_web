const mycards = window.document.getElementById("minhascartas");
const centro = window.document.querySelector(".centro");
const cpucards = window.document.getElementById("cartascomputador");
const botcartas = [];
const resultados = [];
const botOpt = [0, 1, 2];
let jogar = true;
let botRodada = 0;
let jogadorRodada = 0;
let quemComeca = "jogador";
let botEscolha = null;

for (let i = 0; i < jogadores[0].cartas.length; i++) {
    const imagem = document.createElement("img");
    imagem.src = jogadores[0].cartas[i].imagem;
    mycards.appendChild(imagem);

    imagem.addEventListener("click", function () {
        if (!jogar) {
            return;
        }


        if (botEscolha === null) {
            botEscolha = botJoga();
        }

        centro.appendChild(imagem);
        jogar = false;

        const minhaCarta = jogadores[0].cartas[i];
        const botCarta = jogadores[1].cartas[botEscolha];
        const jogadorforca = forca(minhaCarta);
        const botforca = forca(botCarta);

        if (jogadorforca === botforca) {
            console.log("empate");
            resultados.push("Empate");
        }

        else if (jogadorforca > botforca) {
            console.log("Jogador ganhou");
            jogadorRodada += 1;
            resultados.push("Jogador");
        }

        else {
            console.log("bot ganhou");
            botRodada += 1;
            resultados.push("Bot");
        }

        setTimeout(function () {
            centro.replaceChildren();

            const resultadoMao = decidirMao();

            if (resultadoMao === null) {

                const winRodada = resultados[resultados.length - 1];
                if (winRodada == "Bot") {
                    quemComeca = "Bot"
                }

                else if (winRodada == "Jogador") {
                    quemComeca = "Jogador"
                }

                console.log("Quem começa: " + quemComeca)
                jogar = true;
            }

            else if (resultadoMao === "Jogador") {
                jogar = false;
            }

            else if (resultadoMao === "Bot") {
                jogar = false;
            }

            else if (resultadoMao === "Empate") {
                jogar = false;
            }


            console.log(resultados, resultadoMao);
            botEscolha = null;
        }, 2000)
    })
}

for (let i = 0; i < jogadores[0].cartas.length; i++) {
    const imagem = document.createElement("img");
    imagem.src = "../assets/cards/svg/verso.svg"
    cpucards.appendChild(imagem);
    botcartas.push(imagem)
}


function decidirMao() {

    if (jogadorRodada === 2) {
        return "Jogador";
    }

    if (botRodada === 2) {
        return "Bot";
    }

    if (resultados.includes("Empate")) {
        for (let i = 0; i < resultados.length; i++) {
            if (resultados[i] !== "Empate") {
                return resultados[i];
            }
        }

        if (resultados.length == 3) {
            return "Empate";
        }
    }
    return null;
}

function botJoga() {

    const posicao = Math.floor(Math.random() * botOpt.length);
    const escolhabot = botOpt[posicao];
    botOpt.splice(posicao, 1);

    botcartas[escolhabot].src = jogadores[1].cartas[escolhabot].imagem;
    centro.appendChild(botcartas[escolhabot]);

    return escolhabot;

}

console.log(jogadores[1].cartas)
