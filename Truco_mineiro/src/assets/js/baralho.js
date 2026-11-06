const manilha = ["7O", "AE", "7C", "4P"];
const valores = ["4", "5", "6", "7", "Q", "J", "K", "A", "2", "3"];
const naipes = ["P", "O", "E", "C"];

function criarBaralho() {
    const baralho = [];

    for (let naipe of naipes) {
        for (let valor of valores) {
            const carta = {
                valor: valor,
                naipe: naipe,
                imagem: `../assets/cards/svg/${valor}${naipe}.svg`
            };
            baralho.push(carta);
        }
    }
    return baralho;
}

const jogadores = [
    {
        id: 1,
        nome: "Você",
        tipo: "Humano",
        equipe: "1",
        cartas: []
    },
    {
        id: 2,
        nome: "Computador",
        tipo: "cpu",
        equipe: "2",
        cartas: []
    }
]

function distribuir() {
    const baralho = criarBaralho();

    for (let i = baralho.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [baralho[i], baralho[j]] = [baralho[j], baralho[i]];
    }

    for (const jogador of jogadores) {
        jogador.cartas = [];
        for (let k = 0; k < 3; k++) {
            jogador.cartas.push(baralho.pop());
        }
    }
}

distribuir();

function forca(carta) {
    const id = `${carta.valor}${carta.naipe}`;
    const posicao = manilha.indexOf(id);

    if (posicao !== -1) {
        return posicao + 10;
    }
    return valores.indexOf(carta.valor);
}


















