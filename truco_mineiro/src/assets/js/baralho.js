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

const baralho = criarBaralho();
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


for (let i = baralho.length -1; i > 0; i--) {
    let posicaoAleatoria = Math.floor(Math.random() * (i + 1));
    let temporaria = baralho[i];
    baralho[i] = baralho[posicaoAleatoria];
    baralho[posicaoAleatoria] = temporaria;
}


for (let i = 0; i < jogadores.length; i++) {
    for (let j = 0; j < 3; j++) {
        let cartas = baralho.pop()
        jogadores[i].cartas.push(cartas)
    }
};

















