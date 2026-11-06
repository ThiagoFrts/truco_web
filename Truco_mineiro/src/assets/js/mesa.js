const mycards = window.document.getElementById("minhascartas");
const centro = window.document.querySelector(".centro");
const cpucards = window.document.getElementById("cartascomputador");
const pontosJogadorEl = window.document.getElementById("pontosJogador");
const pontosBotEl = window.document.getElementById("pontosBot");

const botcartas = [];
const resultados = [];
const botOpt = [0, 1, 2];
let jogar = true;
let botRodada = 0;
let jogadorRodada = 0;
let quemComeca = "Jogador";
let botEscolha = null;

const placar = { jogador: 0, bot: 0 };
let valorMao = 2;
let jogoAcabou = false;

function montarCartas() {
    mycards.replaceChildren();
    cpucards.replaceChildren();
    centro.replaceChildren();
    botcartas.length = 0;

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
                console.log(jogadores[1].cartas);

            setTimeout(function () {
                centro.replaceChildren();

                const resultadoMao = decidirMao();

                if (resultadoMao === null) {
                    const winRodada = resultados[resultados.length - 1];
                    if (winRodada === "Bot") {
                        quemComeca = "Bot";
                    }
                    else if (winRodada === "Jogador") {
                        quemComeca = "Jogador";
                    }

                    botEscolha = null;

                    if (quemComeca === "Bot") {
                        setTimeout(function () {
                            botEscolha = botJoga();
                            jogar = true;
                        }, 1000);
                    }
                    else {
                        jogar = true;
                    }
                }
                else {
                    jogar = false;
                    pontuar(resultadoMao);

                    if (!jogoAcabou) {
                        setTimeout(novaMao, 1500);
                    }
                }

                console.log(resultados, resultadoMao);
            }, 2000);
        });
    }

    for (let i = 0; i < jogadores[1].cartas.length; i++) {
        const imagem = document.createElement("img");
        imagem.src = "../assets/cards/svg/verso.svg";
        cpucards.appendChild(imagem);
        botcartas.push(imagem);
    }
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

function pontuar(vencedor) {
    if (vencedor === "Jogador") {
        placar.jogador += valorMao;
    } else if (vencedor === "Bot") {
        placar.bot += valorMao;
    }

    pontosJogadorEl.textContent = placar.jogador;
    pontosBotEl.textContent = placar.bot;

    if (placar.jogador >= 12) {
        fimDeJogo("Você");
    } else if (placar.bot >= 12) {
        fimDeJogo("Computador");
    }
}

function fimDeJogo(nome) {
    jogoAcabou = true;
    jogar = false;
    if (typeof mostrarFimDeJogo === "function") {
        mostrarFimDeJogo(nome);
    } else {
        alert(nome + " venceu a partida!");
    }
}

function novaMao() {
    distribuir();

    resultados.length = 0;
    botOpt.length = 0;
    botOpt.push(0, 1, 2);
    jogadorRodada = 0;
    botRodada = 0;
    botEscolha = null;
    valorMao = 2;

    montarCartas();

    quemComeca = (quemComeca === "Jogador") ? "Bot" : "Jogador";

    if (quemComeca === "Bot") {
        setTimeout(function () {
            botEscolha = botJoga();
            jogar = true;
        }, 1000);
    } else {
        jogar = true;
    }
}

montarCartas();


