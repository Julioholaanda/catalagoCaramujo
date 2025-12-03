/* ---------- Dados iniciais de exemplo (serão gravados apenas se não existir) ---------- */
const exemploProdutos = [
  { nome: "Potes Termico", preco: 29.90, categoria: "potes", imagem: "https://via.placeholder.com/600x400?text=Pote+1L", info: "Pote térmico 1L - ideal para alimentos." },
  { nome: "Potes de Plásticos", preco: 39.90, categoria: "potes", imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTERPju9ncajUg54WfUaHIIFPiPY2a62Qx9Jw&s", info: "Conjunto de potes plásticos - 3 peças." },
  { nome: "Mamitex de ispor", preco: 24.90, categoria: "potes", imagem: "https://via.placeholder.com/600x400?text=Pote+3L", info: "Pote grande para armazenamento." },
  { nome: "Camiseta Básica Branca", preco: 59.90, categoria: "camisetas", imagem: "https://via.placeholder.com/600x400?text=Camiseta+Branca", info: "Algodão 100% - diversos tamanhos." },
  { nome: "Relógio Digital Esportivo", preco: 199.90, categoria: "relogios", imagem: "https://via.placeholder.com/600x400?text=Relógio+Digital", info: "Resistente à água, funções esportivas." },
];

/* ---------- Keys LocalStorage ---------- */
const KEY_PRODUTOS = "caramujo_produtos_v1";
const KEY_USUARIOS = "caramujo_usuarios_v1";
const KEY_LOGADO = "caramujo_logado_v1";

/* ---------- Inicialização (cria dados e usuário padrão) ---------- */
function initStorageIfNeeded() {
  if (!localStorage.getItem(KEY_PRODUTOS)) {
    localStorage.setItem(KEY_PRODUTOS, JSON.stringify(exemploProdutos));
  }
  if (!localStorage.getItem(KEY_USUARIOS)) {
    // usuario padrao
    const admin = [{ email: "admin@admin.com", senha: "1234" }];
    localStorage.setItem(KEY_USUARIOS, JSON.stringify(admin));
  }
}

/* ---------- UTIL ---------- */
function lerProdutos() {
  return JSON.parse(localStorage.getItem(KEY_PRODUTOS) || "[]");
}
function salvarProdutos(arr) {
  localStorage.setItem(KEY_PRODUTOS, JSON.stringify(arr));
}

/* ---------- INDEX (catálogo) ---------- */
let categoriaAtual = "todos";
let termoBusca = "";

function carregarCatalogo() {
  const container = document.getElementById("catalogo");
  if (!container) return; // se não estiver na index
  container.innerHTML = "";

  const produtos = lerProdutos();

  const filtrados = produtos.filter(p => {
    const categoriaOK = categoriaAtual === "todos" || (p.categoria && p.categoria.toLowerCase() === categoriaAtual.toLowerCase());
    const buscaOK = !termoBusca || (p.nome && p.nome.toLowerCase().includes(termoBusca.toLowerCase()));
    return categoriaOK && buscaOK;
  });

  if (filtrados.length === 0) {
    container.innerHTML = "<p style='grid-column:1/-1; text-align:center;'>Nenhum produto encontrado.</p>";
    return;
  }

  filtrados.forEach((produto, idx) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const imgSrc = produto.imagem && produto.imagem.length ? produto.imagem : "https://via.placeholder.com/600x400?text=Sem+imagem";

    card.innerHTML = `
      <img src="${imgSrc}" alt="${escapeHtml(produto.nome)}">
      <div class="info">
        <div>
          <h3>${escapeHtml(produto.nome)}</h3>
          <p class="preco">${produto.preco ? `R$ ${Number(produto.preco).toFixed(2)}` : `Sob consulta`}</p>
        </div>

        <div style="display:flex; justify-content:center; gap:10px; margin-top:8px;">
          <button class="btn-info" data-idx="${idx}">+ Informações</button>
        </div>
      </div>

      <div class="detalhes" id="detalhes-${idx}">
        <strong>Categoria:</strong> ${produto.categoria || '—'}<br/>
        <strong>Descrição:</strong> ${produto.info ? escapeHtml(produto.info) : 'Sem descrição.'}
      </div>
    `;

    // botão info abre/fecha a div .detalhes correspondente
    card.querySelector(".btn-info").addEventListener("click", (e) => {
      const id = `detalhes-${e.currentTarget.dataset.idx}`;
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.toggle("open");
    });

    container.appendChild(card);
  });
}

/* escape simples para segurança mínima ao injetar texto */
function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ativar menu de categorias */
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

/* busca dinamica */
function ativarBusca() {
  const campoBusca = document.getElementById("campo-busca");
  if (!campoBusca) return;
  campoBusca.addEventListener("input", e => {
    termoBusca = e.target.value.trim();
    carregarCatalogo();
  });
}

/* ---------- ADMIN (admin.html) ---------- */
function areaAdminInit() {
  const loginBox = document.getElementById("login-box");
  const painel = document.getElementById("painel-admin");
  const btnInitUser = document.getElementById("btn-init-user");
  const btnLogin = document.getElementById("btn-login");
  const btnLogout = document.getElementById("btn-logout");

  const form = document.getElementById("form-produto");
  const listaAdmin = document.getElementById("lista-produtos-admin");

  let editIndex = -1;

  // criar usuário padrão manual (caso queira recriar)
  if (btnInitUser) {
    btnInitUser.addEventListener("click", () => {
      const usuarios = JSON.parse(localStorage.getItem(KEY_USUARIOS) || "[]");
      usuarios.push({ email: "admin@admin.com", senha: "1234" });
      localStorage.setItem(KEY_USUARIOS, JSON.stringify(usuarios));
      alert("Usuário padrão criado (admin@admin.com / 1234)");
    });
  }

  // login
  if (btnLogin) {
    btnLogin.addEventListener("click", () => {
      const email = document.getElementById("admin-email").value.trim();
      const senha = document.getElementById("admin-senha").value.trim();
      const usuarios = JSON.parse(localStorage.getItem(KEY_USUARIOS) || "[]");
      const achou = usuarios.find(u => u.email === email && u.senha === senha);
      if (achou) {
        localStorage.setItem(KEY_LOGADO, email);
        mostrarPainel();
      } else {
        alert("Usuário ou senha incorretos.");
      }
    });
  }

  function mostrarPainel() {
    if (loginBox) loginBox.classList.add("hidden");
    if (painel) painel.classList.remove("hidden");
    carregarProdutosAdmin();
  }

  // se já está logado
  if (localStorage.getItem(KEY_LOGADO)) {
    mostrarPainel();
  }

  // logout
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem(KEY_LOGADO);
      location.reload();
    });
  }

  // salvar produto (adicionar ou editar)
  if (form) {
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const nome = document.getElementById("p-nome").value.trim();
      const preco = document.getElementById("p-preco").value.trim();
      const categoria = document.getElementById("p-categoria").value.trim();
      const info = document.getElementById("p-info").value.trim();
      const file = document.getElementById("p-imagem").files[0];

      if (!nome) return alert("Nome é obrigatório.");

      // lidar com imagem — se houver, converter para base64
      let imagemFinal = "";

// 1° → se escolheu arquivo
const arquivo = document.getElementById("img-arquivo").files[0];

// 2° → se digitou URL
const urlDigitada = document.getElementById("img-url").value.trim();

// PRIORIDADE: se enviar arquivo → usa arquivo
if (arquivo) {
    const leitor = new FileReader();
    leitor.onload = function(e) {
        imagemFinal = e.target.result;
        salvarProdutoComImagem();
    };
    leitor.readAsDataURL(arquivo);
} 
else {
    // senão, usa URL (pode ser vazia também)
    imagemFinal = urlDigitada;
    salvarProdutoComImagem();
}

function salvarProdutoComImagem() {
    const novoProduto = {
        id: editandoId || Date.now(),
        nome: document.getElementById("nome").value,
        preco: document.getElementById("preco").value || "—",
        categoria: document.getElementById("categoria").value,
        imagem: imagemFinal, // agora pode ser arquivo OU URL
        descricao: document.getElementById("descricao").value
    };

    // salva no localStorage
    if (!editandoId) {
        produtos.push(novoProduto);
    } else {
        const index = produtos.findIndex(p => p.id === editandoId);
        produtos[index] = novoProduto;
    }

    localStorage.setItem("produtos", JSON.stringify(produtos));
    alert("Produto salvo!");
    window.location.reload();
}


      const produtos = lerProdutos();

      if (editIndex >= 0) {
        // edição
        const produto = produtos[editIndex];
        produto.nome = nome;
        produto.preco = preco ? Number(preco) : null;
        produto.categoria = categoria;
        produto.info = info;
        if (imagemBase64) produto.imagem = imagemBase64;
        salvarProdutos(produtos);
        editIndex = -1;
        document.getElementById("btn-cancel-edit").classList.add("hidden");
      } else {
        // criar novo
        produtos.push({
          nome,
          preco: preco ? Number(preco) : null,
          categoria,
          imagem: imagemBase64 || "",
          info
        });
        salvarProdutos(produtos);
      }

      form.reset();
      carregarProdutosAdmin();
      alert("Produto salvo com sucesso.");
    });
  }

  // cancelar edição
  const btnCancelar = document.getElementById("btn-cancel-edit");
  if (btnCancelar) {
    btnCancelar.addEventListener("click", () => {
      editIndex = -1;
      document.getElementById("btn-cancel-edit").classList.add("hidden");
      form.reset();
    });
  }

  // carregar lista no admin
  function carregarProdutosAdmin() {
    const produtos = lerProdutos();
    listaAdmin.innerHTML = "";
    if (produtos.length === 0) {
      listaAdmin.innerHTML = "<p>Nenhum produto cadastrado.</p>";
      return;
    }

    produtos.forEach((p, i) => {
      const item = document.createElement("div");
      item.classList.add("prod-admin");

      const imgSrc = p.imagem && p.imagem.length ? p.imagem : "https://via.placeholder.com/600x400?text=Sem+imagem";

      item.innerHTML = `
        <img src="${imgSrc}" alt="${escapeHtml(p.nome)}">
        <div class="meta">
          <h4>${escapeHtml(p.nome)}</h4>
          <div><strong>Categoria:</strong> ${p.categoria || '—'}</div>
          <div><strong>Preço:</strong> ${p.preco ? `R$ ${Number(p.preco).toFixed(2)}` : 'Sob consulta'}</div>
        </div>
        <div class="acoes">
          <button data-edit="${i}">Editar</button>
          <button data-del="${i}" class="ghost">Excluir</button>
        </div>
      `;

      // editar
      item.querySelector("[data-edit]").addEventListener("click", () => {
        editIndex = i;
        const produto = lerProdutos()[i];
        document.getElementById("p-nome").value = produto.nome || "";
        document.getElementById("p-preco").value = produto.preco || "";
        document.getElementById("p-categoria").value = produto.categoria || "";
        document.getElementById("p-info").value = produto.info || "";
        document.getElementById("btn-cancel-edit").classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      // excluir
      item.querySelector("[data-del]").addEventListener("click", () => {
        if (!confirm(`Excluir "${p.nome}" ?`)) return;
        const arr = lerProdutos();
        arr.splice(i, 1);
        salvarProdutos(arr);
        carregarProdutosAdmin();
      });

      listaAdmin.appendChild(item);
    });
  }
}

/* helper para converter arquivo em base64 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---------- Inicialização global ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initStorageIfNeeded();

  // Se estivermos no index (catalogo)
  if (document.getElementById("catalogo")) {
    ativarMenu();
    ativarBusca();
    carregarCatalogo();
  }

  // Se estivermos no admin
  if (document.getElementById("painel-admin") || document.getElementById("login-box")) {
    areaAdminInit();
  }
});
