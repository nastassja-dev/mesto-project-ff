import "../pages/index.css";
import logoPath from "../images/logo.svg";
import avatarPath from "../images/avatar.jpg";
import editIcon from "../images/edit-icon.svg";
import { createCard } from "./card.js";
import {
  openModal,
  closeModal,
  closeByEsc,
  setOverlayCloseHandlers,
} from "./modal.js";
import {
  enableValidation,
  clearValidation,
  isImageUrlValid,
} from "./validation.js";
import {
  checkResponse,
  getUserInfo,
  getInitialCards,
  updateUserInfo,
  addNewCard,
  deleteCard,
  likeCard,
  unlikeCard,
  deleteCardFromServer,
  updateAvatar,
} from "./api.js";

// DOM узлы
const logo = document.getElementById("logo");
if (logo) logo.src = logoPath;

const avatar = document.getElementById("avatar");
const avatarEditIcon = document.querySelector(".profile__avatar-edit-icon");
const avatarPopup = document.querySelector(".popup_type_avatar");
const avatarForm = avatarPopup.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");
const placesList = document.querySelector(".places__list");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const editPopup = document.querySelector(".popup_type_edit");
const addPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");
const popupImage = imagePopup.querySelector(".popup__image");
const popupCaption = imagePopup.querySelector(".popup__caption");
const closeButtons = document.querySelectorAll(".popup__close");
const editProfileForm = document.querySelector(".popup_type_edit .popup__form");
const nameInput = editProfileForm.querySelector(".popup__input_type_name");
const jobInput = editProfileForm.querySelector(
  ".popup__input_type_description"
);
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const addCardForm = document.querySelector(".popup_type_new-card .popup__form");
const templateElement = document.querySelector('#card-template').content;
const cardNameInput = addCardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = addCardForm.querySelector(".popup__input_type_url");
const deleteForm = document.querySelector(".popup_type_delete-card");
const confirmDeleteButton = document.querySelector("#delete-confirm-button");
const icon = new Image();
icon.src = editIcon;
icon.alt = "Редактировать аватар";
icon.classList.add("profile__avatar-edit-icon");
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__input-error_visible",
};

enableValidation(validationConfig);

document.getElementById("avatar").append(icon);
setOverlayCloseHandlers();

// Универсальная функция renderSaving
export function renderSaving(
  isSaving,
  buttonElement,
  defaultText = "Сохранить"
) {
  buttonElement.textContent = isSaving ? "Сохранение..." : defaultText;
}

// Функция обработчика клика по картинке карточки
function handleImageClick(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openModal(imagePopup);
}

// Загрузка пользователя и карточек с сервера
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    avatar.style.backgroundImage = `url(${userData.avatar})`;
    const userId = userData._id;  // Сохраняем id пользователя

    cards.forEach((cardData) => {
      // Передаем параметры в createCard как объект
      const card = createCard({
        cardData,                // данные карточки
        userId,                  // id текущего пользователя
        templateElement,         // шаблон карточки
        handleImageClick,        // обработчик клика по картинке
        handleDeleteClick: handleDeleteCard,  // обработчик удаления
        handleLikeToggle: handleLikeCard      // обработчик лайка
      });
      placesList.append(card);
    });
  })
  .catch((err) => {
    console.error("Ошибка загрузки данных:", err);
  });

// Обработчик добавления новой карточки
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  renderSaving(true, submitButton);
  const name = cardNameInput.value;
  const link = cardLinkInput.value;

  addNewCard({ name, link })
    .then((cardData) => {
      const card = createCard({
        cardData,
        userId: window.userId,       // используем глобальную переменную userId, если так принято
        templateElement,
        handleImageClick,
        handleDeleteClick: handleDeleteCard,
        handleLikeToggle: handleLikeCard
      });
      placesList.prepend(card);
      closeModal(addPopup);
      addCardForm.reset();
      clearValidation(addCardForm, validationConfig);
    })
    .catch((err) => console.error("Ошибка добавления карточки:", err))
    .finally(() => renderSaving(false, submitButton));
}
addCardForm.addEventListener("submit", handleAddCardSubmit);

// Функция удаления карточки
let currentCardToDelete = null;

function handleDeleteCard(cardElement, cardId) {
  currentCardToDelete = { cardElement, cardId };
  openModal(deleteForm);
}

// Обработчик подтверждения удаления
confirmDeleteButton.addEventListener("click", () => {
  if (currentCardToDelete) {
    const { cardElement, cardId } = currentCardToDelete;
    deleteCardFromServer(cardId)
      .then(() => {
        cardElement.remove();
        closeModal(deleteForm);
        currentCardToDelete = null;
      })
      .catch((err) => console.error("Ошибка при удалении карточки:", err));
  }
});

// Открытие попапа редактирования профиля
editButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(editProfileForm, validationConfig);
  openModal(editPopup);
});

// Обработчик отправки формы редактирования профиля
function handleFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  renderSaving(true, submitButton); // "Сохранение..."

  const name = nameInput.value;
  const about = jobInput.value;

  updateUserInfo({ name, about })
    .then((data) => {
      profileTitle.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editPopup);
    })
    .catch((err) => {
      console.error("Ошибка при обновлении профиля:", err);
    })
    .finally(() => {
      renderSaving(false, submitButton); // Возвращаем "Сохранить"
    });
}
editProfileForm.addEventListener("submit", handleFormSubmit);

// Открытие попапа добавления карточки
addButton.addEventListener("click", () => {
  addCardForm.reset();
  clearValidation(addCardForm, validationConfig);
  openModal(addPopup);
});

// Закрытие по крестику
closeButtons.forEach((button) => {
  button.addEventListener("click", (evt) => {
    const popup = evt.target.closest(".popup");
    closeModal(popup);
  });
});

// Функция лайка/дизлайка карточки
function handleLikeCard(cardId, isLiked) {
  const toggleLike = isLiked ? unlikeCard : likeCard;
  return toggleLike(cardId); // Возвращаем промис, чтобы дальше можно было .then()
}

// Слушатель на кнопку подтверждения удаления
export let currentDeleteCardCallback = null;

export function setDeleteCardCallback(callback) {
  currentDeleteCardCallback = callback;
}

confirmDeleteButton.addEventListener("click", () => {
  if (typeof currentDeleteCardCallback === "function") {
    currentDeleteCardCallback();
    currentDeleteCardCallback = null;
  }
});

// Обработчик отправки формы для обновления аватара
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  renderSaving(true, submitButton);

  const avatarUrl = avatarInput.value;

  isImageUrlValid(avatarUrl)
    .then((isValid) => {
      if (!isValid) {
        const errorEl = avatarForm.querySelector(`#${avatarInput.id}-error`);
        avatarInput.classList.add(validationConfig.inputErrorClass);
        errorEl.textContent = "Недопустимый URL изображения.";
        errorEl.classList.add(validationConfig.errorClass);
        throw new Error("Валидация изображения не пройдена"); // выбрасываем ошибку, чтобы перейти в catch
      }

      return updateAvatar(avatarUrl);
    })
    .then((userData) => {
      avatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(avatarPopup);
      avatarForm.reset();
      clearValidation(avatarForm, validationConfig);
    })
    .catch((err) => {
      console.error("Ошибка при обновлении аватара:", err);
      // Дополнительно можно уведомить пользователя:
      // alert("Произошла ошибка при обновлении аватара. Пожалуйста, попробуйте позже.");
    })
    .finally(() => renderSaving(false, submitButton));
}
avatarForm.addEventListener("submit", handleAvatarSubmit);

//Открытие popup по клику на иконку
avatar.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
});


