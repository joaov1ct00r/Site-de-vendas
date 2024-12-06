const API_URL = "http://localhost:3000/produtos";

const produtosContainer = document.querySelector('[data-produtos]');

// Função para buscar produtos do servidor
async function buscarProdutos() {
    const resposta = await fetch(API_URL);
    const produtos = await resposta.json();
    return produtos;
}

// Função para renderizar produtos
async function renderizarProdutos() {
    const produtos = await buscarProdutos();
    produtosContainer.innerHTML = ''; // Limpar produtos antigos

    if (produtos.length === 0) {
        produtosContainer.innerHTML = `<p class="nenhum-produto">Nenhum produto foi adicionado.</p>`;
        return;
    }

    produtos.forEach((produto) => {
        const card = document.createElement('div');
        card.classList.add('produto-card');
        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <p>${produto.nome}</p>
            <p>R$ ${produto.preco.toFixed(2)}</p>
            <button class="btn-excluir" data-id="${produto.id}">Excluir</button>
        `;
        produtosContainer.appendChild(card);
    });
}

// Função para adicionar um novo produto ao servidor
async function adicionarProduto(produto) {
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
    });
    renderizarProdutos();
}

// Função para excluir um produto do servidor
async function excluirProduto(id) {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    renderizarProdutos();
}

// Evento para adicionar produtos
document.getElementById('produtoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const imagemInput = document.getElementById('imagem');
    const imagem = imagemInput.files[0];

    const produto = { nome, preco, imagem: 'default.png' };

    if (imagem) {
        const reader = new FileReader();
        reader.onload = () => {
            produto.imagem = reader.result;
            adicionarProduto(produto);
        };
        reader.readAsDataURL(imagem);
    } else {
        adicionarProduto(produto);
    }

    e.target.reset();
});

// Evento para excluir produtos
produtosContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-excluir')) {
        const id = e.target.getAttribute('data-id');
        excluirProduto(id);
    }
});

// Inicializar a renderização
renderizarProdutos();
