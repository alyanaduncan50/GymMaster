class Modal {
    constructor(modalId) {
      this.modalBackdrop = document.getElementById(modalId);
      this.closeButtons = this.modalBackdrop.querySelectorAll(".close-modal");
      this.initEvents();
    }
  
    show() {
      this.modalBackdrop.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  
    hide() {
      this.modalBackdrop.style.display = "none";
      document.body.style.overflow = "";
    }
  
    initEvents() {
      this.closeButtons.forEach((button) => {
        button.addEventListener("click", () => this.hide());
      });
  
      this.modalBackdrop.addEventListener("click", (event) => {
        if (event.target === this.modalBackdrop) {
          this.hide();
        }
      });
    }
  }
  
  export default Modal;
  