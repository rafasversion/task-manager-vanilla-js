import NavComponent from "./modules/NavComponent.js";
import UserComponent from "./modules/UserComponent.js";
import TarefaComponent from "./modules/TarefaComponent.js";
import CalendarComponent from "./modules/CalendarComponent.js";
import PerfilComponent from "./modules/PerfilComponent.js";

new UserComponent();

if (window.location.pathname.includes("painel")) {
  new TarefaComponent();
  new CalendarComponent();
}

if (window.location.pathname.includes("perfil")) {
  new PerfilComponent();
}
new NavComponent();
