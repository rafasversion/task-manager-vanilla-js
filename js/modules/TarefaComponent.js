import TarefaAPI from "./TarefaAPI.js";
import TarefaModal from "./TarefaModal.js";
import TarefaRender from "./TarefaRender.js";

export default class TarefaComponent {
  constructor() {
    this.userLogadoID = localStorage.getItem("userLogado");

    if (!this.userLogadoID) {
      window.location.href = "./index.html";
      return;
    }

    this.apiUsers = `http://localhost:3000/usuarios/${this.userLogadoID}`;

    this.api = new TarefaAPI(this.apiUsers);
    this.modal = new TarefaModal();
    this.render = new TarefaRender();

    this.tarefas = [];
    this.tarefaEmEdicao = null;
    this.tarefaParaExcluir = null;

    this.initElements();
    this.bindEvents();
    this.carregarTarefas();
  }

  initElements() {
    this.btnAbrirModal = document.getElementById("abrirModal");
    this.btnSalvar = document.getElementById("criarTarefa");

    this.modalExcluir = document.querySelector(".modal-excluir");
    this.btnCancelarExclusao = document.querySelector(".cancelar-exclusao");
    this.btnConfirmarExclusao = document.querySelector(".confirmar-exclusao");
    this.btnFecharExcluir = document.querySelector(".fechar-excluir");

    this.inputBusca = document.getElementById("buscarTarefa");
    this.selectStatus = document.getElementById("status");
    this.btnFiltrar = document.getElementById("filtrarTarefa");
  }

  bindEvents() {
    this.inputBusca.addEventListener("input", () => {
      this.filtrarTarefas();
    });

    this.selectStatus.addEventListener("change", () => {
      this.filtrarTarefas();
    });

    this.btnFiltrar.addEventListener("click", () => {
      this.filtrarTarefas();
    });

    this.btnAbrirModal.addEventListener("click", () => {
      this.tarefaEmEdicao = null;
      this.modal.limpar();
      this.modal.abrir("Adicionar Tarefa");
    });

    this.btnSalvar.addEventListener("click", () => {
      if (this.tarefaEmEdicao) {
        this.salvarEdicao();
      } else {
        this.salvarNovaTarefa();
      }
    });

    this.render.tabela.addEventListener("click", (evento) => {
      this.handleClickTabela(evento);
    });

    this.btnCancelarExclusao.addEventListener("click", () => {
      this.modalExcluir.classList.remove("ativo");
      this.tarefaParaExcluir = null;
    });

    this.btnFecharExcluir.addEventListener("click", () => {
      this.modalExcluir.classList.remove("ativo");
      this.tarefaParaExcluir = null;
    });

    this.btnConfirmarExclusao.addEventListener("click", () => {
      this.confirmarExclusao();
    });
  }

  carregarTarefas() {
    this.api.listarTarefas().then((usuario) => {
      this.tarefas = usuario.tarefas || [];
      this.render.renderizar(this.tarefas);
    });
  }

  salvarNovaTarefa() {
    const dados = this.modal.getDados();

    const novaTarefa = {
      id: Date.now().toString(),
      titulo: dados.titulo,
      descricao: dados.descricao,
      data: dados.data,
      horario: dados.horario,
      status: dados.status,
    };

    this.tarefas.push(novaTarefa);

    this.api.salvarTarefas(this.tarefas).then(() => {
      this.render.renderizar(this.tarefas);
      this.modal.fechar();
      this.modal.limpar();
      alert("Tarefa criada com sucesso!");
    });
  }

  salvarEdicao() {
    const dados = this.modal.getDados();

    const tarefa = this.tarefas.find((t) => t.id === this.tarefaEmEdicao.id);

    if (!tarefa) return;

    tarefa.titulo = dados.titulo;
    tarefa.descricao = dados.descricao;
    tarefa.data = dados.data;
    tarefa.horario = dados.horario;
    tarefa.status = dados.status;

    this.api.salvarTarefas(this.tarefas).then(() => {
      this.render.renderizar(this.tarefas);
      this.modal.fechar();
      this.tarefaEmEdicao = null;
      alert("Tarefa editada com sucesso!");
    });
  }

  handleClickTabela(evento) {
    const botao = evento.target;
    const id = botao.dataset.id;

    if (!id) return;

    if (botao.classList.contains("editar-tarefa")) {
      this.editarTarefa(id);
      return;
    }

    if (botao.classList.contains("excluir-tarefa")) {
      this.excluirTarefa(id);
    }
  }

  editarTarefa(id) {
    this.tarefaEmEdicao = this.tarefas.find((tarefa) => tarefa.id === id);

    if (!this.tarefaEmEdicao) return;

    this.modal.preencher(this.tarefaEmEdicao);
    this.modal.abrir("Editar Tarefa");
  }

  excluirTarefa(id) {
    this.tarefaParaExcluir = id;
    this.modalExcluir.classList.add("ativo");
  }

  confirmarExclusao() {
    if (!this.tarefaParaExcluir) return;

    this.tarefas = this.tarefas.filter(
      (tarefa) => tarefa.id !== this.tarefaParaExcluir
    );

    this.api.salvarTarefas(this.tarefas).then(() => {
      this.render.renderizar(this.tarefas);
      this.modalExcluir.classList.remove("ativo");
      this.tarefaParaExcluir = null;
      alert("Tarefa excluída com sucesso!");
    });
  }

  filtrarTarefas() {
    const termo = document.getElementById("buscarTarefa").value.toLowerCase();
    const status = document.getElementById("status").value;

    const tarefasFiltradas = this.tarefas.filter((tarefa) => {
      const matchTexto =
        tarefa.titulo.toLowerCase().includes(termo) ||
        tarefa.descricao.toLowerCase().includes(termo);

      const matchStatus = status === "Todas" || tarefa.status === status;

      return matchTexto && matchStatus;
    });

    this.render.renderizar(tarefasFiltradas);
  }
}
