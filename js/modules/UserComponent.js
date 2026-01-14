export default class UserComponent {
  constructor() {
    this.users = [];
    this.apiUsers = "http://localhost:3000/usuarios";
    this._navbarEventsBinded = false;
    this.initElements();
    this.bindEvents();
    this.verificarLogin();
  }

  initElements() {
    this.btnAbrirModal = document.querySelector(".navbar__link--login");
    this.modalLogin = document.querySelector(".modal__login");
    this.btnFecharModal = document.querySelector(".fechar__login");
    this.tabs = document.querySelectorAll(".tab");
    this.forms = document.querySelectorAll(".form__login");
    this.btnRegister = document.querySelector("#btnRegister");
    this.btnLogin = document.querySelector("#btnLogin");
    this.nomeCompleto = document.querySelector("#nomeCompleto");
    this.email = document.querySelector("#email");
    this.senha = document.querySelector("#senha");
    this.tarefas = [];
    this.emailLogin = document.querySelector("#loginEmail");
    this.senhaLogin = document.querySelector("#loginSenha");
    this.userBtn = document.getElementById("userMenuBtn");
    this.dropdown = document.getElementById("userDropdown");
    this.logoutBtn = document.getElementById("logoutBtn");
  }

  bindEvents() {
    if (this.btnAbrirModal)
      this.btnAbrirModal.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleModal();
      });

    if (this.btnFecharModal)
      this.btnFecharModal.addEventListener("click", () => this.toggleModal());

    if (this.tabs.length) {
      this.tabs.forEach((tab) =>
        tab.addEventListener("click", () => this.switchTab(tab.dataset.tab))
      );
    }

    if (this.btnRegister)
      this.btnRegister.addEventListener("click", () => this.registerUser());

    if (this.btnLogin)
      this.btnLogin.addEventListener("click", (e) => {
        e.preventDefault();
        this.loginUser();
      });

    if (!this._navbarEventsBinded) {
      this._navbarEventsBinded = true;

      if (this.userBtn && this.dropdown) {
        this.userBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.dropdown.style.display =
            this.dropdown.style.display === "flex" ? "none" : "flex";
        });

        this.dropdown.addEventListener("click", (e) => {
          e.stopPropagation();
        });

        document.addEventListener("click", () => {
          if (this.dropdown) this.dropdown.style.display = "none";
        });
      }

      if (this.logoutBtn) {
        this.logoutBtn.addEventListener("click", () => {
          localStorage.removeItem("userLogado");
          window.location.href = "./index.html";
        });
      }
    }
  }

  toggleModal() {
    if (!this.modalLogin) return;
    if (localStorage.getItem("userLogado")) return;
    this.modalLogin.classList.toggle("ativo");
  }

  switchTab(tab) {
    this.tabs.forEach((t) => t.classList.remove("ativo"));
    this.forms.forEach((f) => f.classList.remove("ativo"));
    document.querySelector(`[data-tab="${tab}"]`)?.classList.add("ativo");
    document.querySelector(`[data-form="${tab}"]`)?.classList.add("ativo");
  }

  gerarHash(senha) {
    let hash = 0;
    for (let i = 0; i < senha.length; i++) {
      hash += senha.charCodeAt(i);
    }
    return hash.toString();
  }

  getDadosFormularioRegistro() {
    return {
      nomeCompleto: this.nomeCompleto.value,
      email: this.email.value,
      senha: this.gerarHash(this.senha.value),
      tarefas: this.tarefas,
    };
  }

  validarSenha(senha) {
    const temTamanhoMinimo = senha.length >= 6;
    const temMaiuscula = senha !== senha.toLowerCase();
    const temNumero = /\d/.test(senha);
    const temSimbolo = /[^a-zA-Z0-9]/.test(senha);

    return temTamanhoMinimo && temMaiuscula && temNumero && temSimbolo;
  }

  verificarEmailExiste(email, users) {
    return users.some((user) => user.email === email);
  }

  registerUser() {
    const senhaDigitada = this.senha.value;

    if (!this.validarSenha(senhaDigitada)) {
      alert(
        "Senha inválida. Use pelo menos 6 caracteres, uma letra maiúscula, um número e um símbolo."
      );
      return;
    }

    fetch(this.apiUsers)
      .then((res) => res.json())
      .then((users) => {
        if (this.verificarEmailExiste(this.email.value, users)) {
          alert("Este email já está cadastrado");
          throw new Error("EMAIL_EXISTENTE");
        }

        const dados = this.getDadosFormularioRegistro();

        return fetch(this.apiUsers, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        });
      })
      .then((res) => {
        if (!res) return;
        alert("Conta criada com sucesso!");
        this.toggleModal();
      })
      .catch((err) => {
        if (err.message !== "EMAIL_EXISTENTE") {
          console.error(err);
          alert("Erro ao criar conta");
        }
      });
  }

  verificarLogin() {
    const userLogado = localStorage.getItem("userLogado");

    if (this.btnAbrirModal) this.btnAbrirModal.style.display = "none";
    if (this.userBtn) this.userBtn.style.display = "none";
    if (this.dropdown) this.dropdown.style.display = "none";

    if (!userLogado) {
      if (this.btnAbrirModal) {
        this.btnAbrirModal.style.display = "inline-block";
        this.btnAbrirModal.textContent = "Login";
      }
      return;
    }

    if (this.userBtn) {
      this.userBtn.style.display = "flex";
    }
  }

  loginUser() {
    fetch(this.apiUsers)
      .then((res) => res.json())
      .then((users) => {
        const senhaHash = this.gerarHash(this.senhaLogin.value);

        const userExistente = users.find(
          (user) =>
            user.email === this.emailLogin.value && user.senha === senhaHash
        );

        if (userExistente) {
          localStorage.setItem("userLogado", userExistente.id);
          window.location.href = "./painel.html";
        } else {
          alert("Email ou senha incorretos");
        }
      });
  }
}
