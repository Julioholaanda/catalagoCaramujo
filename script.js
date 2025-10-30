// Lista de produtos (exemplo)
const produtos = [
  { nome: "Potes Termico", preco: 29.90, categoria: "potes", imagem: "https://via.placeholder.com/300x200?text=Pote+1L" },
  { nome: "Potes de Plásticos", preco: 39.90, categoria: "potes", imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTERPju9ncajUg54WfUaHIIFPiPY2a62Qx9Jw&s" },
  { nome: "Mamitex de ispor", preco: 24.90, categoria: "potes", imagem: "https://via.placeholder.com/300x200?text=Pote+3L" },
  { nome: "Camiseta Básica Branca", preco: 59.90, categoria: "camisetas", imagem: "https://via.placeholder.com/300x200?text=Camiseta+Branca" },
  { nome: "Camiseta Preta Premium", preco: 79.90, categoria: "camisetas", imagem: "https://via.placeholder.com/300x200?text=Camiseta+Preta" },
  { nome: "Relógio Digital Esportivo", preco: 199.90, categoria: "relogios", imagem: "https://via.placeholder.com/300x200?text=Relógio+Digital" },
  { nome: "Relógio de Pulso Clássico", preco: 249.90, categoria: "relogios", imagem: "https://via.placeholder.com/300x200?text=Relógio+Clássico" },
];

let categoriaAtual = "todos";
let termoBusca = "";

// Atualiza o catálogo de produtos
function carregarCatalogo() {
  const container = document.getElementById("catalogo");
  container.innerHTML = "";

  // Filtra produtos por categoria e busca
  const filtrados = produtos.filter(p => {
    const categoriaOK = categoriaAtual === "todos" || p.categoria === categoriaAtual;
    const buscaOK = p.nome.toLowerCase().includes(termoBusca.toLowerCase());
    return categoriaOK && buscaOK;
  });

  if (filtrados.length === 0) {
    container.innerHTML = "<p style='grid-column:1/-1; text-align:center;'>Nenhum produto encontrado.</p>";
    return;
  }

  // Monta os cards
  filtrados.forEach(produto => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <div class="info">
        <h3>${produto.nome}</h3>
        <p>R$ ${produto.preco.toFixed(2)}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

// Função para mudar de categoria
function ativarMenu() {
  const botoes = document.querySelectorAll(".categoria");
  botoes.forEach(btn => {
    btn.addEventListener("click", () => {
      botoes.forEach(b => b.classList.remove("ativa"));
      btn.classList.add("ativa");
      categoriaAtual = btn.getAttribute("data-categoria");
      carregarCatalogo();
    });
  });
}

// Busca dinâmica
function ativarBusca() {
  const campoBusca = document.getElementById("campo-busca");
  campoBusca.addEventListener("input", e => {
    termoBusca = e.target.value;
    carregarCatalogo();
  });
}

// Inicializa o site
document.addEventListener("DOMContentLoaded", () => {
  ativarMenu();
  ativarBusca();
  carregarCatalogo();
});
