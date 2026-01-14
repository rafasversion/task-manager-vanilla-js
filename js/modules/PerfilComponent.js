export default class PerfilComponent {
  constructor() {
    this.userId = localStorage.getItem("userLogado");
    if (!this.userId) {
      window.location.href = "./index.html";
      return;
    }
    this.api = `http://localhost:3000/usuarios/${this.userId}`;
    document.addEventListener("DOMContentLoaded", () => {
      this.initElements();
      this.bindEvents();
      this.carregar();
    });
  }

  initElements() {
    this.nomeEl = document.getElementById("perfilNome");
    this.emailEl = document.getElementById("perfilEmail");
    this.modalPerfil = document.getElementById("modalPerfil");
    this.modalSenha = document.getElementById("modalSenha");
    this.editNome = document.getElementById("editNome");
    this.editEmail = document.getElementById("editEmail");
    this.senhaAtual = document.getElementById("senhaAtual");
    this.novaSenha = document.getElementById("novaSenha");
    this.confirmarSenha = document.getElementById("confirmarSenha");
    this.btnEditarPerfil = document.getElementById("editarPerfil");
    this.btnEditarSenha = document.getElementById("editarSenha");
    this.btnSalvarPerfil = document.getElementById("salvarPerfil");
    this.btnSalvarSenha = document.getElementById("salvarSenha");
    this.btnExcluir = document.getElementById("excluirPerfil");
    this.btnFecharPerfil = document.getElementById("fecharPerfil");
    this.btnFecharSenha = document.getElementById("fecharSenha");
  }

  bindEvents() {
    this.btnEditarPerfil.addEventListener("click", () =>
      this.modalPerfil.classList.add("ativo")
    );
    this.btnFecharPerfil.addEventListener("click", () =>
      this.modalPerfil.classList.remove("ativo")
    );
    this.btnSalvarPerfil.addEventListener("click", () => this.salvarPerfil());
    this.btnEditarSenha.addEventListener("click", () =>
      this.modalSenha.classList.add("ativo")
    );
    this.btnFecharSenha.addEventListener("click", () =>
      this.modalSenha.classList.remove("ativo")
    );
    this.btnSalvarSenha.addEventListener("click", () => this.salvarSenha());
    this.btnExcluir.addEventListener("click", () => this.excluir());
  }

  carregar() {
    fetch(this.api)
      .then((res) => res.json())
      .then((user) => {
        this.nomeEl.textContent = user.nomeCompleto;
        this.emailEl.textContent = user.email;
        this.editNome.value = user.nomeCompleto;
        this.editEmail.value = user.email;
      });
  }

  salvarPerfil() {
    fetch(this.api, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nomeCompleto: this.editNome.value,
        email: this.editEmail.value,
      }),
    }).then(() => {
      this.modalPerfil.classList.remove("ativo");
      this.carregar();
    });
  }

  salvarSenha() {
    if (this.novaSenha.value !== this.confirmarSenha.value) {
      alert("As senhas não coincidem");
      return;
    }

    fetch(this.api)
      .then((res) => res.json())
      .then((user) => {
        const senhaAtualHash = this.gerarHash(this.senhaAtual.value);

        if (user.senha !== senhaAtualHash) {
          alert("Senha atual incorreta");
          return;
        }

        const novaSenhaHash = this.gerarHash(this.novaSenha.value);

        return fetch(this.api, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senha: novaSenhaHash }),
        });
      })
      .then(() => {
        this.modalSenha.classList.remove("ativo");
        this.senhaAtual.value = "";
        this.novaSenha.value = "";
        this.confirmarSenha.value = "";
      });
  }

  excluir() {
    if (!confirm("Tem certeza que deseja excluir sua conta?")) return;
    fetch(this.api, { method: "DELETE" }).then(() => {
      localStorage.removeItem("userLogado");
      window.location.href = "./index.html";
    });
  }

  gerarHash(senha) {
    let hash = 0;
    for (let i = 0; i < senha.length; i++) {
      hash += senha.charCodeAt(i);
    }
    return hash.toString();
  }
}
