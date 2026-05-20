import Popup from "./Popup.js";

class PopupWithConfirmation extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._button = this._popup.querySelector("#delete-confirm-button");
  }

  setConfirmAction(action) {
    this._confirmAction = action;
  }

  setEventListeners() {
    super.setEventListeners();
    this._button.addEventListener("click", () => {
      if (this._confirmAction) {
        this._confirmAction();
      }
    });
  }
}

export default PopupWithConfirmation;