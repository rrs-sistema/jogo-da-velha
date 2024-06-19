const JogoVelha = () => {
    let total = 0;
    let venceu = false;
    let podeJogar = false;
    let quadro;
    let jogadas = [];

    const mensagens = [
        'Aperte jogar para iniciar',
        'Agora é a vez de:',
        'Venceu o jogo',
        'Jogo empatado'
    ]
    const self = {
        robo: true,
        vez: '',
        texto: mensagens[0],
        bottonLabel: 'Jogar'
    };

    const checkMatching = (val1, val2, val3) => {
        if (jogadas[val1] === jogadas[val2] && jogadas[val2] === jogadas[val3]) {
            return jogadas[val1];
        }
    }

    const clickedBox = (elemento) => {
        if (elemento) {
            total++;
            const id = elemento.getAttribute('data-id');
            if (!podeJogar || jogadas[id]) {// Verifica se o jogador pode jogar ou se a celular já foi preenchida
                return false;
            }
            elemento.innerText = self.vez;
            jogadas[id] = self.vez;

            if (self.vez === 'x') {
                self.vez = 'o';
            } else {
                self.vez = 'x';
            }
            // Verifica todas as opções do jogador ganhar a partida
            const winner = (checkMatching(1, 2, 3) || checkMatching(4, 5, 6) || checkMatching(7, 8, 9) ||
                checkMatching(1, 4, 7) || checkMatching(2, 5, 8) || checkMatching(3, 6, 9) ||
                checkMatching(1, 5, 9) || checkMatching(3, 5, 7));
            if (winner) {
                total = 0;
                venceu = true;
                self.vez = winner;
                self.texto = mensagens[2];
                podeJogar = false;
            }
        }

        if (!venceu && self.robo && total > 8) {
            self.texto = mensagens[3];
            self.vez = '';
            //podeJogar = false;
            return false;
        }

        return true;
    }

    self.init = (elemento) => {
        quadro = elemento;
        elemento.addEventListener('click', (e) => {
            switch (e.target.tagName) {
                case 'SPAN':
                    if (clickedBox(e.target)) {
                        if (self.robo && !venceu) {
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
        total = 0;
        podeJogar = true;
        venceu = false;
        self.vez = 'x';
        self.texto = mensagens[1];
        jogadas = [];
        const cells = quadro.querySelectorAll('span');
        for (let i = 0; i < cells.length; i++) {
            cells[i].innerText = '';
        }
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
                    <span>{{self.texto}}</span>
                    <span class="gui_turn">{{self.vez}}</span>
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