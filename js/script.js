// Dados iniciais caso o navegador ainda não tenha nada salvo
const alunosIniciais = [
    { id: 1, nome: "Aluno: Carlos Silva", curtido: false, curtidas: 0, comentarios: [] },
    { id: 2, nome: "Aluna: Mariana Costa", curtido: false, curtidas: 0, comentarios: [] },
    { id: 3, nome: "Aluno: Rafael Souza", curtido: false, curtidas: 0, comentarios: [] },
    { id: 4, nome: "Aluna: Beatriz Lima", curtido: false, curtidas: 0, comentarios: [] }
];

// Puxa os dados salvos do localStorage
let alunos = JSON.parse(localStorage.getItem('dadosAlunos')) || alunosIniciais;

const container = document.getElementById('feed-container');

function salvarNoNavegador() {
    localStorage.setItem('dadosAlunos', JSON.stringify(alunos));
}

function renderizarFeed() {
    container.innerHTML = '';

    // Ordena por quem tem mais curtidas
    const listaOrdenada = [...alunos].sort((a, b) => b.curtidas - a.curtidas);

    listaOrdenada.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-id', item.id);
        
        // CORREÇÃO: Agora mapeamos o texto E o índice do comentário para podermos apagá-lo depois
        const comentariosHTML = item.comentarios.map((textoComentario, indice) => `
            <div class="comentario-item">
                <span>💬 ${textoComentario}</span>
                <button class="delete-comment-btn" onclick="apagarComentario(${item.id}, ${indice})">&times;</button>
            </div>
        `).join('');

        card.innerHTML = `
            <div class="card-header">
                <h3 class="nome-aluno">${item.nome}</h3>
                <button class="like-btn ${item.curtido ? 'liked' : ''}" onclick="alternarCurtida(${item.id})">
                    <span>${item.curtido ? '❤️' : '🤍'}</span>
                    <span class="counter">${item.curtidas}</span>
                </button>
            </div>
            
            <div class="comments-section">
                <div class="comentarios-lista" id="lista-${item.id}">
                    ${comentariosHTML}
                </div>
                <div class="comentario-input-box">
                    <input type="text" id="input-${item.id}" placeholder="Escreva um comentário..." onkeypress="verificarTecla(event, ${item.id})">
                    <button onclick="adicionarComentario(${item.id})">Enviar</button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function alternarCurtida(id) {
    const item = alunos.find(a => a.id === id);
    if (item) {
        if (item.curtido) {
            item.curtido = false;
            item.curtidas--;
        } else {
            item.curtido = true;
            item.curtidas++;
        }
        salvarNoNavegador();
        renderizarFeed();
    }
}

function adicionarComentario(id) {
    const input = document.getElementById(`input-${id}`);
    const texto = input.value.trim();

    if (texto === '') return;

    const item = alunos.find(a => a.id === id);
    if (item) {
        item.comentarios.push(texto);
        salvarNoNavegador();
        
        // Como o botão de apagar precisa do índice correto do array,
        // o jeito mais seguro para o ambiente demo é re-renderizar o feed
        // para mapear os índices certinho.
        renderizarFeed();
        
        // Limpa o input e foca novamente
        const novoInput = document.getElementById(`input-${id}`);
        novoInput.value = '';
        novoInput.focus();
        
        // Rola até o fim da lista
        const listaComentarios = document.getElementById(`lista-${id}`);
        listaComentarios.scrollTop = listaComentarios.scrollHeight;
    }
}

// NOVA FUNÇÃO: Apaga o comentário baseado no ID do aluno e na posição (index) do comentário
function apagarComentario(alunoId, comentarioIndex) {
    const item = alunos.find(a => a.id === alunoId);
    if (item) {
        // Remove 1 elemento na posição do index
        item.comentarios.splice(comentarioIndex, 1);
        salvarNoNavegador(); // Atualiza o localStorage sem o comentário
        renderizarFeed();   // Atualiza a tela na hora
    }
}

function verificarTecla(event, id) {
    if (event.key === 'Enter') {
        adicionarComentario(id);
    }
}

// Inicializa o sistema
renderizarFeed();