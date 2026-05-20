import "../pages/index.css";
import logoImage from "../images/aroundtheUSwhite.svg";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";
import UserInfo from "../components/UserInfo.js";
import api from "../components/Api.js";
import { validationConfig, selectors } from "../utils/utils.js";

// Static images
const headerImage = document.querySelector(".header__image");
if (headerImage) headerImage.src = logoImage;

// DOM Elements
const profileFormElement = document.querySelector(selectors.profileForm);
const addCardFormElement = document.querySelector(selectors.addCardForm);
const profileEditButton = document.querySelector(selectors.profileEditButton);
const addNewCardButton = document.querySelector(selectors.addCardButton);
const nameInput = profileFormElement.querySelector(selectors.profileNameInput);
const jobInput = profileFormElement.querySelector(selectors.profileJobInput);

// UserInfo
const userInfo = new UserInfo({
  nameSelector: selectors.profileTitle,
  jobSelector: selectors.profileDescription,
  avatarSelector: ".profile__image",
});

// Image preview popup
const imagePopup = new PopupWithImage(selectors.previewImageModal);
imagePopup.setEventListeners();

function handleImageClick(data) {
  imagePopup.open(data);
}

// Delete popup
const deletePopup = new PopupWithConfirmation("#delete-card-modal");
deletePopup.setEventListeners();

function handleDeleteClick(cardId, cardElement) {
  deletePopup.setConfirmAction(() => {
    api.deleteCard(cardId)
      .then(() => {
        cardElement.remove();
        deletePopup.close();
      })
      .catch(err => console.error(err));
  });
  deletePopup.open();
}

// Card creation
function createCard(cardData) {
  const card = new Card(cardData, selectors.cardTemplate, handleImageClick, handleDeleteClick);
  return card.getView();
}

// Card section
const cardSection = new Section(
  {
    items: [],
    renderer: (cardData) => {
      const cardElement = createCard(cardData);
      cardSection.addItem(cardElement);
    },
  },
  selectors.cardsList
);

// Profile edit popup
const profilePopup = new PopupWithForm(selectors.profileEditModal, (formData) => {
  profilePopup.renderLoading(true);
  api.updateProfile({ name: formData.name, about: formData.description })
    .then(userData => {
      userInfo.setUserInfo({ name: userData.name, job: userData.about });
      profilePopup.close();
    })
    .catch(err => console.error(err))
    .finally(() => profilePopup.renderLoading(false));
});
profilePopup.setEventListeners();

// Add card popup
const addCardPopup = new PopupWithForm(selectors.addCardModal, (formData) => {
  addCardPopup.renderLoading(true);
  api.addCard({ name: formData.title, link: formData.url })
    .then(cardData => {
      const cardElement = createCard(cardData);
      cardSection.addItem(cardElement);
      addCardPopup.close();
    })
    .catch(err => console.error(err))
    .finally(() => addCardPopup.renderLoading(false));
});
addCardPopup.setEventListeners();

console.log(document.querySelector("#avatar-edit-modal"));

// Avatar popup
const avatarPopup = new PopupWithForm("#avatar-edit-modal", (formData) => {
  avatarPopup.renderLoading(true);
  api.updateAvatar({ avatar: formData.avatar })
    .then(userData => {
      userInfo.setAvatar({ avatar: userData.avatar });
      avatarPopup.close();
    })
    .catch(err => console.error(err))
    .finally(() => avatarPopup.renderLoading(false));
});
avatarPopup.setEventListeners();

document.querySelector(".profile__image-wrapper").addEventListener("click", () => {
  avatarPopup.open();
});

// Form validators
const editFormValidator = new FormValidator(validationConfig, profileFormElement);
const addFormValidator = new FormValidator(validationConfig, addCardFormElement);
editFormValidator.enableValidation();
addFormValidator.enableValidation();

// Button event listeners
profileEditButton.addEventListener("click", () => {
  const userData = userInfo.getUserInfo();
  nameInput.value = userData.name;
  jobInput.value = userData.job;
  editFormValidator.resetValidation();
  profilePopup.open();
});

addNewCardButton.addEventListener("click", () => {
  addFormValidator.resetValidation();
  addCardPopup.open();
});

// Load data from server
api.getAppInfo()
  .then(([userData, cards]) => {
    userInfo.setUserInfo({ name: userData.name, job: userData.about });
    userInfo.setAvatar({ avatar: userData.avatar });
    cards.forEach(cardData => {
      const cardElement = createCard(cardData);
      cardSection.addItem(cardElement);
    });
  })
  .catch(err => console.error(err));