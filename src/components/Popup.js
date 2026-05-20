class Popup {
  constructor(popupSelector) {
    this._popup = document.querySelector(popupSelector);
    this._handleEscClose = this._handleEscClose.bind(this);
  }

  open() {
    this._popup.classList.add("modal_is-opened");
    document.addEventListener("keydown", this._handleEscClose);
  }

  close() {
    this._popup.classList.remove("modal_is-opened");
    document.removeEventListener("keydown", this._handleEscClose);
  }

  _handleEscClose(evt) {
    if (evt.key === "Escape") {
      this.close();
    }
  }

  setEventListeners() {
    // Close button
    this._popup.querySelector(".modal__close").addEventListener("click", () => {
      this.close();
    });

    // Click on overlay (shaded area)
    this._popup.addEventListener("click", (evt) => {
      if (evt.target === this._popup) {
        this.close();
      }
    });
  }
}

export default Popup;
