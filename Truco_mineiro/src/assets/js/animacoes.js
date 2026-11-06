(function () {
    "use strict";

    const mesa = document.querySelector(".mesa");
    const maoJogador = document.getElementById("minhascartas");
    const maoBot = document.getElementById("cartascomputador");
    const centro = document.querySelector(".centro");
    const baralho = document.getElementById("baralho");
    const pontosEl = {
        Jogador: document.getElementById("pontosJogador"),
        Bot: document.getElementById("pontosBot")
    };

    if (!mesa || !maoJogador || !maoBot || !centro || !pontosEl.Jogador || !pontosEl.Bot) {
        return;
    }

    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const PONTOS_PARA_VENCER = 12;

    const posicoes = new WeakMap();
    const pontosAntes = { Jogador: 0, Bot: 0 };
    let rodadaAvaliada = false;
    let avisoAtual = null;

    const anuncio = document.createElement("div");
    anuncio.className = "sr-only";
    anuncio.setAttribute("aria-live", "polite");
    document.body.appendChild(anuncio);

    maoJogador.dataset.bloqueada = "false";

    function medir(el) {
        let x = 0;
        let y = 0;
        let no = el;
        while (no && no !== mesa) {
            x += no.offsetLeft;
            y += no.offsetTop;
            no = no.offsetParent;
        }
        return { x: x, y: y, w: el.offsetWidth, h: el.offsetHeight };
    }

    function deslocamento(de, para) {
        return {
            dx: (de.x + de.w / 2) - (para.x + para.w / 2),
            dy: (de.y + de.h / 2) - (para.y + para.h / 2)
        };
    }

    function lembrarTudo() {
        for (const area of [maoJogador, maoBot, centro]) {
            for (const img of area.querySelectorAll("img")) {
                posicoes.set(img, medir(img));
            }
        }
    }

    function distribuir(cartas) {
        const origem = baralho ? medir(baralho) : null;

        cartas.forEach(function (img, i) {
            const para = medir(img);
            posicoes.set(img, para);
            if (reduzir || !origem) {
                return;
            }

            const d = deslocamento(origem, para);
            const giro = img.dataset.dono === "bot" ? -180 : 180;

            img.animate([
                { transform: "translate(" + d.dx + "px, " + d.dy + "px) rotate(" + giro + "deg) scale(0.6)", opacity: 0 },
                { opacity: 1, offset: 0.2 },
                { transform: "translate(0, 0) rotate(0deg) scale(1)", opacity: 1 }
            ], {
                duration: 560,
                delay: i * 120,
                easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
                fill: "backwards"
            });
        });
    }

    function jogada(img) {
        const de = posicoes.get(img);
        const para = medir(img);
        posicoes.set(img, para);
        if (reduzir) {
            return;
        }

        const bot = img.dataset.dono === "bot";
        const d = de ? deslocamento(de, para) : { dx: 0, dy: bot ? -120 : 120 };
        const inicio = "translate(" + d.dx + "px, " + d.dy + "px)";

        const quadros = bot
            ? [
                { transform: inicio + " perspective(700px) rotateY(90deg) scale(0.9)" },
                { transform: "translate(" + d.dx * 0.2 + "px, " + d.dy * 0.2 + "px) perspective(700px) rotateY(-10deg) scale(1.1)", offset: 0.65 },
                { transform: "translate(0, 0) perspective(700px) rotateY(0deg) scale(1)" }
            ]
            : [
                { transform: inicio + " scale(1)" },
                { transform: "translate(0, 0) scale(1.1)", offset: 0.7 },
                { transform: "translate(0, 0) scale(1)" }
            ];

        img.animate(quadros, {
            duration: bot ? 560 : 420,
            easing: "cubic-bezier(0.2, 0.8, 0.2, 1)"
        });
    }

    function sumir(img) {
        const r = posicoes.get(img);
        if (!r || reduzir) {
            return;
        }

        const m = mesa.getBoundingClientRect();
        const fantasma = document.createElement("img");
        fantasma.src = img.src;
        fantasma.alt = "";
        fantasma.className = "fantasma";
        fantasma.style.left = (m.left + mesa.clientLeft + r.x) + "px";
        fantasma.style.top = (m.top + mesa.clientTop + r.y) + "px";
        fantasma.style.width = r.w + "px";
        fantasma.style.height = r.h + "px";
        document.body.appendChild(fantasma);

        const anim = fantasma.animate([
            { opacity: 1, transform: "none" },
            { opacity: 0, transform: "translateY(-28px) rotate(-6deg) scale(0.85)" }
        ], { duration: 450, easing: "ease-in", fill: "forwards" });

        anim.onfinish = function () {
            fantasma.remove();
        };
    }

    function anunciar(texto) {
        anuncio.textContent = texto;
    }

    function aviso(texto, tipo) {
        anunciar(texto);

        if (avisoAtual) {
            avisoAtual.remove();
        }

        const el = document.createElement("div");
        el.className = "aviso" + (tipo ? " aviso--" + tipo : "");
        el.setAttribute("aria-hidden", "true");
        el.textContent = texto;
        el.style.top = centro.offsetTop + "px";
        mesa.appendChild(el);
        avisoAtual = el;

        const cheio = "translate(-50%, -50%)";
        const quadros = reduzir
            ? [{ opacity: 0 }, { opacity: 1, offset: 0.12 }, { opacity: 1, offset: 0.85 }, { opacity: 0 }]
            : [
                { opacity: 0, transform: "translate(-50%, -15%) scale(0.9)" },
                { opacity: 1, transform: cheio + " scale(1)", offset: 0.12 },
                { opacity: 1, transform: cheio + " scale(1)", offset: 0.85 },
                { opacity: 0, transform: "translate(-50%, -90%) scale(1)" }
            ];

        const anim = el.animate(quadros, { duration: 2000 });
        anim.onfinish = function () {
            el.remove();
            if (avisoAtual === el) {
                avisoAtual = null;
            }
        };
    }

    function cartaDaImagem(img) {
        const achou = /([^/]+)\.svg/.exec(img.src);
        if (!achou) {
            return null;
        }
        const id = achou[1];
        return { valor: id.slice(0, -1), naipe: id.slice(-1) };
    }

    function avaliarRodada() {
        const cartas = Array.from(centro.querySelectorAll("img"));
        if (cartas.length !== 2 || typeof forca !== "function") {
            return;
        }

        const doJogador = cartas.find(function (c) { return c.dataset.dono === "jogador"; });
        const doBot = cartas.find(function (c) { return c.dataset.dono === "bot"; });
        if (!doJogador || !doBot) {
            return;
        }

        const cj = cartaDaImagem(doJogador);
        const cb = cartaDaImagem(doBot);
        if (!cj || !cb) {
            return;
        }

        const forcaJogador = forca(cj);
        const forcaBot = forca(cb);

        if (forcaJogador === forcaBot) {
            aviso("Empate!", "empate");
            return;
        }

        const jogadorVenceu = forcaJogador > forcaBot;
        (jogadorVenceu ? doJogador : doBot).classList.add("vencedora");
        (jogadorVenceu ? doBot : doJogador).classList.add("perdedora");
        anunciar(jogadorVenceu ? "Você ganhou a rodada" : "Computador ganhou a rodada");
    }

    function atualizarPlacar() {
        for (const quem of ["Jogador", "Bot"]) {
            const el = pontosEl[quem];
            const agora = parseInt(el.textContent, 10) || 0;
            const antes = pontosAntes[quem];

            el.parentElement.style.setProperty("--pct", Math.min(100, (agora / PONTOS_PARA_VENCER) * 100));

            if (agora !== antes) {
                pontosAntes[quem] = agora;
                if (agora > antes) {
                    celebrarPontos(el, agora - antes, quem);
                }
            }
        }
    }

    function celebrarPontos(el, ganho, quem) {
        const nome = quem === "Jogador" ? "Você" : "Computador";
        anunciar(nome + " levou a mão (+" + ganho + ")");

        if (reduzir) {
            return;
        }

        el.animate([
            { transform: "scale(1)" },
            { transform: "scale(1.7)", color: "#ffffff", offset: 0.35 },
            { transform: "scale(1)" }
        ], { duration: 650, easing: "ease-out" });

        const r = el.getBoundingClientRect();
        const flutua = document.createElement("div");
        flutua.className = "flutua";
        flutua.setAttribute("aria-hidden", "true");
        flutua.textContent = "+" + ganho;
        flutua.style.left = (r.left + r.width / 2) + "px";
        flutua.style.top = r.top + "px";
        document.body.appendChild(flutua);

        const anim = flutua.animate([
            { opacity: 1, transform: "translate(-50%, 0)" },
            { opacity: 0, transform: "translate(-50%, -60px)" }
        ], { duration: 1100, easing: "ease-out", fill: "forwards" });

        anim.onfinish = function () {
            flutua.remove();
        };
    }

    window.mostrarFimDeJogo = function (nome) {
        const venceu = nome === "Você";
        const placarFinal = pontosEl.Jogador.textContent + " x " + pontosEl.Bot.textContent;

        setTimeout(function () {
            const modal = document.createElement("div");
            modal.className = "modal " + (venceu ? "modal--vitoria" : "modal--derrota");
            modal.setAttribute("role", "dialog");
            modal.setAttribute("aria-modal", "true");
            modal.setAttribute("aria-labelledby", "modal-titulo");

            const caixa = document.createElement("div");
            caixa.className = "modal__caixa";

            const emoji = document.createElement("span");
            emoji.className = "modal__emoji";
            emoji.setAttribute("aria-hidden", "true");
            emoji.textContent = venceu ? "\uD83C\uDFC6" : "\uD83C\uDCCF";

            const titulo = document.createElement("h2");
            titulo.id = "modal-titulo";
            titulo.textContent = venceu ? "Você venceu!" : "O computador venceu";

            const texto = document.createElement("p");
            texto.textContent = "Placar final: " + placarFinal + (venceu ? ". Jogou muito!" : ". Quer a revanche?");

            const acoes = document.createElement("div");
            acoes.className = "modal__acoes";

            const denovo = document.createElement("button");
            denovo.type = "button";
            denovo.className = "btn";
            denovo.textContent = "Jogar de novo";
            denovo.addEventListener("click", function () {
                window.location.reload();
            });

            const menu = document.createElement("a");
            menu.className = "btn btn--fantasma";
            menu.href = "jogar.html";
            menu.textContent = "Voltar ao menu";

            acoes.append(denovo, menu);
            caixa.append(emoji, titulo, texto, acoes);
            modal.appendChild(caixa);
            document.body.appendChild(modal);

            if (!reduzir) {
                modal.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
                caixa.animate([
                    { transform: "translateY(30px) scale(0.92)", opacity: 0 },
                    { transform: "translateY(0) scale(1)", opacity: 1 }
                ], { duration: 450, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" });

                if (venceu) {
                    confete();
                }
            }

            anuncio.textContent = titulo.textContent + ". " + texto.textContent;
            denovo.focus();
        }, reduzir ? 0 : 900);
    };

    function confete() {
        const cores = ["#e0a526", "#f6d26b", "#d63c4f", "#2b8650", "#fbf6e9"];

        for (let i = 0; i < 80; i++) {
            const pedaco = document.createElement("div");
            pedaco.className = "confete";
            pedaco.setAttribute("aria-hidden", "true");
            pedaco.style.left = (Math.random() * 100) + "vw";
            pedaco.style.background = cores[i % cores.length];
            document.body.appendChild(pedaco);

            const deriva = (Math.random() - 0.5) * 240;
            const giro = 360 + Math.random() * 720;
            const anim = pedaco.animate([
                { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
                { transform: "translate(" + deriva + "px, " + (window.innerHeight + 40) + "px) rotate(" + giro + "deg)", opacity: 0.85 }
            ], {
                duration: 1800 + Math.random() * 1800,
                delay: Math.random() * 600,
                easing: "cubic-bezier(0.3, 0.1, 0.6, 1)",
                fill: "backwards"
            });

            anim.onfinish = function () {
                pedaco.remove();
            };
        }
    }

    function aoMudar(registros) {
        const novas = new Set();
        const removidas = [];
        let placarMudou = false;

        for (const r of registros) {
            if (r.type === "characterData" || r.target === pontosEl.Jogador || r.target === pontosEl.Bot) {
                placarMudou = true;
                continue;
            }

            r.addedNodes.forEach(function (n) {
                if (n.nodeType === 1 && n.tagName === "IMG") {
                    novas.add(n);
                }
            });
            r.removedNodes.forEach(function (n) {
                if (n.nodeType === 1 && n.tagName === "IMG") {
                    removidas.push(n);
                }
            });
        }

        for (const img of removidas) {
            if (!img.isConnected) {
                sumir(img);
            }
        }

        const daMaoJogador = [];
        const daMaoBot = [];
        const jogadas = [];

        for (const img of novas) {
            if (!img.isConnected) {
                continue;
            }
            const pai = img.parentElement;

            if (pai === maoJogador && !img.dataset.dono) {
                img.dataset.dono = "jogador";
                daMaoJogador.push(img);
            } else if (pai === maoBot && !img.dataset.dono) {
                img.dataset.dono = "bot";
                daMaoBot.push(img);
            } else if (pai === centro) {
                jogadas.push(img);
            }
        }

        const entrega = [];
        const maior = Math.max(daMaoJogador.length, daMaoBot.length);
        for (let i = 0; i < maior; i++) {
            if (daMaoJogador[i]) { entrega.push(daMaoJogador[i]); }
            if (daMaoBot[i]) { entrega.push(daMaoBot[i]); }
        }
        if (entrega.length) {
            distribuir(entrega);
        }
        jogadas.forEach(jogada);

        const naMesa = centro.querySelectorAll("img").length;
        maoJogador.dataset.bloqueada = naMesa >= 2 ? "true" : "false";

        if (naMesa >= 2 && !rodadaAvaliada) {
            rodadaAvaliada = true;
            setTimeout(avaliarRodada, reduzir ? 0 : 520);
        }
        if (naMesa < 2) {
            rodadaAvaliada = false;
        }

        if (placarMudou) {
            atualizarPlacar();
        }

        lembrarTudo();
    }

    const observador = new MutationObserver(aoMudar);
    observador.observe(maoJogador, { childList: true });
    observador.observe(maoBot, { childList: true });
    observador.observe(centro, { childList: true });
    observador.observe(pontosEl.Jogador, { childList: true, characterData: true, subtree: true });
    observador.observe(pontosEl.Bot, { childList: true, characterData: true, subtree: true });

    let esperaResize = null;
    window.addEventListener("resize", function () {
        clearTimeout(esperaResize);
        esperaResize = setTimeout(lembrarTudo, 150);
    });
})();