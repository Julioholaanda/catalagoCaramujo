let categoriaAtual = "todos";
let termoBusca = "";

function carregarCatalogo() {
  fetch("/produtos")
    .then((res) => res.json())
    .then((produtos) => {
      const container = document.getElementById("catalogo");
      container.innerHTML = "";

      // Filtra produtos por categoria e busca
      const filtrados = produtos.filter((p) => {
        const categoriaOk = categoriaAtual === "todos" || p.categoria === categoriaAtual;
        const buscaOk = p.nome.toLowerCase().includes(termoBusca.toLowerCase());
        return categoriaOk && buscaOk;
      });

      if (filtrados.length === 0) {
        container.innerHTML = `<p style="grid-column:1/-1; text-align:center;">Nenhum produto encontrado.</p>`;
        return;
      }

      filtrados.forEach((produto) => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
          <img src="${produto.imagem}" alt="${produto.nome}" />
          <div class="info">
            <h3>${produto.nome}</h3>
            <p>R$ ${produto.preco.toFixed(2)}</p>
          </div>
          <button class="button-info">+ Informações</button>
          <div class="info-extra"><p>${produto.descricao}</p></div>
        `;

        // Mostrar/esconder informações extras
        card.querySelector(".button-info").addEventListener("click", () => {
          const info = card.querySelector(".info-extra");
          info.style.display = info.style.display === "block" ? "none" : "block";
        });

        container.appendChild(card);
      });
    });
}

function ativarMenu() {
  const botoes = document.querySelectorAll(".categoria");
  botoes.forEach((btn) => {
    btn.addEventListener("click", () => {
      botoes.forEach((b) => b.classList.remove("ativa"));
      btn.classList.add("ativa");
      categoriaAtual = btn.getAttribute("data-categoria");
      carregarCatalogo();
    });
  });
}

function ativarBusca() {
  const campoBusca = document.getElementById("campo-busca");
  campoBusca.addEventListener("input", (e) => {
    termoBusca = e.target.value;
    carregarCatalogo();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  ativarMenu();
  ativarBusca();
  carregarCatalogo();
});
