export default class TarefaModal {
  constructor() {
    this.initElements();
  }

  initElements() {
    this.modal = document.querySelector(".modal");
    this.titulo = document.getElementById("titulo");
    this.descricao = document.getElementById("descricao");
    this.data = document.getElementById("data");
    this.horario = document.getElementById("horario");
    this.status = document.getElementById("statusModal");
    this.tituloModal = document.querySelector(".form-tarefa h2");
  }

  abrir(titulo = "Adicionar Tarefa") {
    this.tituloModal.textContent = titulo;
    this.modal.classList.add("ativo");
  }

  fechar() {
    this.modal.classList.remove("ativo");
  }

  limpar() {
    this.titulo.value = "";
    this.descricao.value = "";
    this.data.value = "";
    this.horario.value = "";
    this.status.value = "Pendente";
  }

  preencher(tarefa) {
    this.titulo.value = tarefa.titulo;
    this.descricao.value = tarefa.descricao;
    this.data.value = tarefa.data;
    this.horario.value = tarefa.horario;
    this.status.value = tarefa.status;
  }

  getDados() {
    return {
      titulo: this.titulo.value,
      descricao: this.descricao.value,
      data: this.data.value,
      horario: this.horario.value,
      status: this.status.value,
    };
  }
}
