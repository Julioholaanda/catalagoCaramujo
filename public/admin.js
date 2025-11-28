// Bloquear acesso sem login
if (!localStorage.getItem("admin")) {
  alert("Acesso não autorizado!");
  window.location.href = "login.html";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("admin");
  window.location.href = "login.html";
});

function salvarProduto() {
  const produto = {
    nome: document.getElementById("nome").value.trim(),
    preco: parseFloat(document.getElementById("preco").value),
    categoria: document.getElementById("categoria").value.trim(),
    imagem: document.getElementById("imagem").value.trim(),
    descricao: document.getElementById("descricao").value.trim(),
  };

  if (!produto.nome || !produto.preco || !produto.categoria || !produto.imagem) {
    document.getElementById("msg").innerText = "Preencha todos os campos obrigatórios!";
    return;
  }

  fetch("/produtos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(produto),
  })
    .then((r) => r.json())
    .then(() => {
      document.getElementById("msg").innerText = "Produto salvo com sucesso!";
      // Limpar formulário
      document.getElementById("nome").value = "";
      document.getElementById("preco").value = "";
      document.getElementById("categoria").value = "";
      document.getElementById("imagem").value = "";
      document.getElementById("descricao").value = "";
    })
    .catch(() => {
      document.getElementById("msg").innerText = "Erro ao salvar produto.";
    });
}
