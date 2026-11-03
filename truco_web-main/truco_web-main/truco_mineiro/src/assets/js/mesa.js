// ===== ELEMENTOS DA TELA =====
const mycards = window.document.getElementById("minhascartas");
const centro = window.document.querySelector(".centro");
const cpucards = window.document.getElementById("cartascomputador");
const pontosJogadorEl = window.document.getElementById("pontosJogador");
const pontosBotEl = window.document.getElementById("pontosBot");

// ===== ESTADO DA MÃO =====
const botcartas = [];
const resultados = [];
const botOpt = [0, 1, 2];
let jogar = true;
let botRodada = 0;
let jogadorRodada = 0;
let quemComeca = "Jogador";
let botEscolha = null;

// ===== ESTADO DO PLACAR =====
const placar = { jogador: 0, bot: 0 };
let valorMao = 2; // truco mineiro: a mão começa valendo 2
let jogoAcabou = false;


// ===== MONTAR AS CARTAS NA TELA =====
function montarCartas() {
    // limpa o que sobrou da mão anterior
    mycards.replaceChildren();
    cpucards.replaceChildren();
    centro.replaceChildren();
    botcartas.length = 0;

    // suas cartas
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
                    // a mão continua: quem ganhou a rodada começa a próxima
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
                    // a mão acabou: pontua e começa outra (se o jogo não acabou)
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

    // verso das cartas do computador
    for (let i = 0; i < jogadores[1].cartas.length; i++) {
        const imagem = document.createElement("img");
        imagem.src = "../assets/cards/svg/verso.svg";
        cpucards.appendChild(imagem);
        botcartas.push(imagem);
    }
}


// ===== DECIDIR QUEM GANHOU A MÃO =====
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


// ===== BOT ESCOLHE UMA CARTA =====
function botJoga() {

    const posicao = Math.floor(Math.random() * botOpt.length);
    const escolhabot = botOpt[posicao];
    botOpt.splice(posicao, 1);

    botcartas[escolhabot].src = jogadores[1].cartas[escolhabot].imagem;
    centro.appendChild(botcartas[escolhabot]);

    return escolhabot;
}


// ===== PLACAR =====
function pontuar(vencedor) {
    if (vencedor === "Jogador") {
        placar.jogador += valorMao;
    } else if (vencedor === "Bot") {
        placar.bot += valorMao;
    }
    // se for "Empate", ninguém pontua

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
    alert(nome + " venceu a partida!");
}


// ===== NOVA MÃO =====
function novaMao() {
    distribuir(); // vem do baralho.js

    resultados.length = 0;
    botOpt.length = 0;
    botOpt.push(0, 1, 2);
    jogadorRodada = 0;
    botRodada = 0;
    botEscolha = null;
    valorMao = 2;

    montarCartas();

    // alterna quem começa a mão
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


// ===== COMEÇA O JOGO =====
montarCartas();