export default class TarefaAPI {
  constructor(apiUsers) {
    this.apiUsers = apiUsers;
  }

  listarTarefas() {
    return fetch(this.apiUsers).then((res) => res.json());
  }

  salvarTarefas(tarefas) {
    return fetch(this.apiUsers, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tarefas }),
    });
  }
}
