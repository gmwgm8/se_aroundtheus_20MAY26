import api from "./Api.js";

class Card {
  constructor(data, cardSelector, handleImageClick, handleDeleteClick) {
    this._name = data.name;
    this._link = data.link;
    this._id = data._id;
    this._isLiked = data.isLiked;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._handleDeleteClick = handleDeleteClick;
  }

  _setEventListeners() {
    this._likeButton.addEventListener("click", () => {
      this._handleLikeButton();
    });

    this._deleteButton.addEventListener("click", () => {
      this._handleDeleteClick(this._id, this._cardElement);
    });

    this._cardImage.addEventListener("click", () => {
      this._handleImageClick({ name: this._name, link: this._link });
    });
  }

  _handleLikeButton() {
    if (this._isLiked) {
      api.unlikeCard(this._id)
        .then(updatedCard => {
          this._isLiked = updatedCard.isLiked;
          this._likeButton.classList.remove("card__like-button_active");
        })
        .catch(err => console.error(err));
    } else {
      api.likeCard(this._id)
        .then(updatedCard => {
          this._isLiked = updatedCard.isLiked;
          this._likeButton.classList.add("card__like-button_active");
        })
        .catch(err => console.error(err));
    }
  }

  getView() {
    this._cardElement = document
      .querySelector(this._cardSelector)
      .content
      .querySelector(".card")
      .cloneNode(true);

    this._cardImage = this._cardElement.querySelector(".card__image");
    this._cardTitle = this._cardElement.querySelector(".card__title");
    this._likeButton = this._cardElement.querySelector(".card__like-button");
    this._deleteButton = this._cardElement.querySelector(".card__delete-button");

    this._cardImage.src = this._link;
    this._cardImage.alt = this._name;
    this._cardTitle.textContent = this._name;

    if (this._isLiked) {
      this._likeButton.classList.add("card__like-button_active");
    }

    this._setEventListeners();

    return this._cardElement;
  }
}

export default Card;