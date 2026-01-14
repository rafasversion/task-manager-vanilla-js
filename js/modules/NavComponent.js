export default class NavComponent {
  constructor() {
    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.toggle = document.getElementById("menuToggle");
    this.menu = document.getElementById("menuNav");
  }

  bindEvents() {
    this.toggle.addEventListener("click", () => {
      this.menu.classList.toggle("active");
    });
  }
}
