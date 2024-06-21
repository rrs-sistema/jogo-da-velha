class Jogador {
    constructor(nome, simbolo) {
        this.nome = nome;
        this.simbolo = simbolo;
    }
}

class Self {
    constructor(robo, simbolo, texto, bottonLabel, nomeJogadorAtual, jogadores) {
        this.robo = robo;
        this.simbolo = simbolo;
        this.texto = texto;
        this.bottonLabel = bottonLabel;
        this.nomeJogadorAtual = nomeJogadorAtual;
        this.jogadores = jogadores;
    }
}

class InforPlay {
    constructor(total, venceu, podeJogar, quadro, jogadas) {
        this.total = total;
        this.venceu = venceu;
        this.podeJogar = podeJogar;
        this.quadro = quadro;
        this.jogadas = jogadas;
    }
}

const JogoVelha = () => {

    let inforPlay = new InforPlay(0, false, false, null, []);

    const mensagens = [
        'Aperte jogar para iniciar',
        'Agora é sua vez',
        'Venceu o jogo',
        'Jogo empatado'
    ]

    const self = new Self(true, '', mensagens[0], 'Jogar', null, []);

    const checkMatching = (val1, val2, val3) => {
        if (inforPlay.jogadas[val1] === inforPlay.jogadas[val2] && inforPlay.jogadas[val2] === inforPlay.jogadas[val3]) {
            return inforPlay.jogadas[val1];
        }
    }

    const clickedBox = (elemento) => {
        let winner = false;

        if (elemento) {
            inforPlay.total++;
            const id = elemento.getAttribute('data-id');
            if (!inforPlay.podeJogar || inforPlay.jogadas[id]) {// Verifica se o jogador pode jogar ou se a celular já foi preenchida
                return false;
            }
            elemento.innerText = self.simbolo;
            inforPlay.jogadas[id] = self.simbolo;


            // Verifica todas as opções do jogador ganhar a partida
            winner = (checkMatching(1, 2, 3) || checkMatching(4, 5, 6) || checkMatching(7, 8, 9) ||
                checkMatching(1, 4, 7) || checkMatching(2, 5, 8) || checkMatching(3, 6, 9) ||
                checkMatching(1, 5, 9) || checkMatching(3, 5, 7));

            if (winner) {
                inforPlay.total = 0;
                inforPlay.venceu = true;
                self.simbolo = winner;
                self.texto = mensagens[2];
                inforPlay.podeJogar = false;
                const mensagem = document.getElementById('mensagem');
                mensagem.className = "efeitoVenceu"; // Aplica o efeito da mensagem piscando
            } else {
                if (self.simbolo === 'x') {
                    self.simbolo = 'o';
                    let playCurrent = self.jogadores.find(o => o.simbolo.trim() === self.simbolo.trim());
                    self.nomeJogadorAtual = playCurrent.nome + ' - ';
                } else {
                    self.simbolo = 'x';
                    let playCurrent = self.jogadores.find(o => o.simbolo.trim() === self.simbolo.trim());
                    self.nomeJogadorAtual = playCurrent.nome + ' - ';
                }
            }
        }

        if (!inforPlay.venceu && inforPlay.total > 8) {
            const mensagem = document.getElementById('mensagem');
            self.nomeJogadorAtual = '';
            self.texto = mensagens[3];
            self.simbolo = '';
            mensagem.className = "efeitoVenceu";
            return false;
        }

        return true;
    }

    self.init = (elemento) => {
        inforPlay.quadro = elemento;
        elemento.addEventListener('click', (e) => {
            switch (e.target.tagName) {
                case 'SPAN':
                    if (clickedBox(e.target)) {
                        if (self.robo && !inforPlay.venceu) {
                            elemento.style.pointerEvents = 'none';
                            setTimeout(() => {
                                const emptyTitles = elemento.querySelectorAll('span:empty');
                                const cell = emptyTitles[Math.floor(Math.random() * emptyTitles.length)];
                                clickedBox(cell);
                                elemento.style.pointerEvents = '';
                            }, 500);
                        }
                    }
                    break;
                case 'BUTTON':
                    play();
                    break;
            };
        });
    }

    const play = () => {

        let jogador1 = new Jogador('Play One', 'x');
        let jogador2 = new Jogador(self.robo ? 'Máquina' : 'Play Two', 'o');
        self.jogadores.push(jogador1);
        self.jogadores.push(jogador2);

        inforPlay.total = 0;
        inforPlay.podeJogar = true;
        inforPlay.venceu = false;
        self.simbolo = jogador1.simbolo;
        self.nomeJogadorAtual = jogador1.nome + ' - ';
        self.texto = mensagens[1];
        inforPlay.jogadas = [];
        const cells = inforPlay.quadro.querySelectorAll('span');
        for (let i = 0; i < cells.length; i++) {
            cells[i].innerText = '';
        }
        const mensagem = document.getElementById('mensagem');
        mensagem.className = 'none';
        self.bottonLabel = 'Reiniciar';
    }

    const template = `
        <div>
            <h1>Jogo da velha</h1>
            <p class="checkbox">
                Jogar contra a máquina <input type="checkbox" checked @bind="self.robo">
            </p>
            <div>
                <div class="gui">
                    <span id="mensagem">{{self.nomeJogadorAtual}} {{self.texto}}</span>
                </div>
                <div class="quadro" @ready="self.init(this)">
                    <section class="board__column">
                        <span class="board__cell" data-id="1"></span>
                        <span class="board__cell" data-id="2"></span>
                        <span class="board__cell" data-id="3"></span>
                    </section>
                    <section class="board__column">
                        <span class="board__cell" data-id="4"></span>
                        <span class="board__cell" data-id="5"></span>
                        <span class="board__cell" data-id="6"></span>
                    </section>
                    <section class="board__column">
                        <span class="board__cell" data-id="7"></span>
                        <span class="board__cell" data-id="8"></span>
                        <span class="board__cell" data-id="9"></span>
                    </section>
                    <button class="btn">{{self.bottonLabel}}</button>
                </div>
            </div>
        </div>
    `;

    return lemonade.element(template, self);
}
