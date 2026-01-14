export default class CalendarComponent {
  constructor() {
    this.MAX_TAREFAS = 2;
    this.userLogadoID = localStorage.getItem("userLogado");
    this.apiUsers = `http://localhost:3000/usuarios/${this.userLogadoID}`;
    this.today = new Date();
    this.currentMonth = this.today.getMonth();
    this.currentYear = this.today.getFullYear();
    this.tarefas = {};
    this.initElements();
    this.bindEvents();
    this.listarTarefas();
  }

  initElements() {
    this.monthYear = document.querySelector("#month-year");
    this.daysContainer = document.querySelector("#days");
    this.prevBtn = document.querySelector("#prev-month");
    this.nextBtn = document.querySelector("#next-month");
    this.modalTarefa = document.querySelector(".modal-tarefa");
    this.btnFecharModalTarefa = this.modalTarefa.querySelector(".fechar");
    this.modalList = document.querySelector(".modal-list");
  }

  bindEvents() {
    this.prevBtn.addEventListener("click", () => this.navegarParaMesAnterior());
    this.nextBtn.addEventListener("click", () => this.navegarParaProximoMes());
    this.btnFecharModalTarefa.addEventListener("click", () =>
      this.fecharModal()
    );
  }

  navegarParaMesAnterior() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.renderizar();
  }

  navegarParaProximoMes() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.renderizar();
  }

  listarTarefas() {
    fetch(this.apiUsers)
      .then((res) => res.json())
      .then((usuario) => {
        const tarefas = usuario.tarefas || [];
        this.organizarPorData(tarefas);
        this.renderizar();
      });
  }

  organizarPorData(lista) {
    this.tarefas = {};
    lista.forEach((tarefa) => {
      if (!this.tarefas[tarefa.data]) {
        this.tarefas[tarefa.data] = [];
      }
      this.tarefas[tarefa.data].push({
        id: tarefa.id,
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        horario: tarefa.horario,
        status: tarefa.status,
      });
    });
    Object.keys(this.tarefas).forEach((data) => {
      this.tarefas[data].sort((a, b) => a.horario.localeCompare(b.horario));
    });
  }

  abrirModal(tarefasDoDia) {
    this.modalList.innerHTML = tarefasDoDia
      .map(
        (tarefa) => `<div class="modal-tarefa-item ${
          tarefa.status === "Concluída" ? "concluida" : "pendente"
        }">
          <div class="modal-tarefa-hora">${tarefa.horario}</div>
          <div class="modal-tarefa-info">
            <h4>${tarefa.titulo}</h4>
            <p>${tarefa.descricao || "Sem descrição"}</p>
          </div>
          <span class="modal-status">${tarefa.status}</span>
        </div>`
      )
      .join("");
    this.modalTarefa.classList.add("ativo");
  }

  fecharModal = () => {
    this.modalTarefa.classList.remove("ativo");
  };

  renderizar() {
    this.daysContainer.innerHTML = "";
    this.monthYear.textContent = `${new Date(
      this.currentYear,
      this.currentMonth
    ).toLocaleString("pt-BR", { month: "long" })} de ${this.currentYear}`;

    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(
      this.currentYear,
      this.currentMonth + 1,
      0
    ).getDate();

    for (let i = 0; i < firstDay; i++) {
      this.daysContainer.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      this.renderizarDia(day);
    }
  }

  renderizarDia(day) {
    const dayDiv = document.createElement("div");
    const dayNumber = document.createElement("div");
    dayNumber.className = "day-number";
    dayNumber.textContent = day;
    dayDiv.appendChild(dayNumber);

    const dateKey = `${this.currentYear}-${String(
      this.currentMonth + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const tarefasDoDia = this.tarefas[dateKey];

    if (tarefasDoDia) {
      tarefasDoDia.slice(0, this.MAX_TAREFAS).forEach((tarefa) => {
        const div = document.createElement("div");
        div.className = `task ${
          tarefa.status === "Concluída" ? "concluida" : "pendente"
        }`;
        div.textContent = tarefa.titulo;
        dayDiv.appendChild(div);
      });

      if (tarefasDoDia.length > this.MAX_TAREFAS) {
        const mais = document.createElement("button");
        mais.className = "ver-mais";
        mais.textContent = `+${
          tarefasDoDia.length - this.MAX_TAREFAS
        } ver mais`;
        mais.addEventListener("click", () => this.abrirModal(tarefasDoDia));
        dayDiv.appendChild(mais);
      }
    }

    this.daysContainer.appendChild(dayDiv);
  }
}
