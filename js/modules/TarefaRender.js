export default class TarefaRender {
  constructor() {
    this.initElements();
  }

  initElements() {
    this.tabela = document.querySelector(".table-tarefas tbody");
    this.total = document.getElementById("totalTarefas");
    this.pendentes = document.getElementById("tarefasPendentes");
    this.concluidas = document.getElementById("tarefasConcluidas");
    this.barra = document.querySelector(".progresso-preenchido");
    this.texto = document.querySelector(".progresso-texto");
    this.msgVazia = document.querySelector(".nenhuma-tarefa");
  }

  formatarData(data) {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  destacarTexto(texto, termo) {
    if (!termo) return texto;

    const regex = new RegExp(`(${termo})`, "gi");
    return texto.replace(regex, "<mark>$1</mark>");
  }

  renderizar(tarefas) {
    this.tabela.innerHTML = "";

    if (tarefas.length === 0) {
      this.msgVazia.style.display = "block";
      return;
    }

    this.msgVazia.style.display = "none";

    tarefas.forEach((tarefa) => {
      const termo = document.getElementById("buscarTarefa").value;

      this.tabela.innerHTML += `
      <tr>
        <td data-label="Título">
          ${this.destacarTexto(tarefa.titulo, termo)}
          <span class="tarefa-status mobile ${tarefa.status}">
            ${tarefa.status}
          </span>
        </td>

        <td data-label="Descrição">
          ${this.destacarTexto(tarefa.descricao, termo)}
        </td>

        <td data-label="Data">
          ${this.formatarData(tarefa.data)}
        </td>

        <td data-label="Horário">
          ${tarefa.horario}
        </td>

        <td data-label="Status" class="tarefa-status desktop ${tarefa.status}">
          ${tarefa.status}
        </td>

        <td>
          <button class="editar-tarefa" data-id="${tarefa.id}">Editar</button>
          <button class="excluir-tarefa" data-id="${tarefa.id}">🗑</button>
        </td>
      </tr>
    `;
    });

    this.atualizarProgresso(tarefas);
  }

  atualizarProgresso(tarefas) {
    const total = tarefas.length;
    const concluidas = tarefas.filter((t) => t.status === "Concluída").length;

    this.total.textContent = total;
    this.concluidas.textContent = concluidas;
    this.pendentes.textContent = total - concluidas;

    const porcentagem = total ? Math.round((concluidas / total) * 100) : 0;

    this.barra.style.width = `${porcentagem}%`;
    this.texto.textContent = `${porcentagem}% concluído`;
  }
}
