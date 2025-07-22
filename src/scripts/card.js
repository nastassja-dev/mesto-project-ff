import { likeCard, unlikeCard, deleteCardFromServer } from "./api.js";
import { openModal, closeModal } from "./modal.js";
import { setDeleteCardCallback } from "./index.js";

const cardTemplate = document.querySelector("#card-template").content;
const popupDelete = document.querySelector("#popup-delete");

let deleteCardCallback = null;

export function createCard(cardData, handleImageClick) {
  const cardElement = cardTemplate.cloneNode(true).querySelector(".card");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCounter = cardElement.querySelector(".card__like-count");

  cardTitle.textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  likeCounter.textContent = cardData.likes.length;

  const userId = window.userId;

  // Показываем иконку удаления только если пользователь — владелец карточки
  if (cardData.owner._id === userId) {
    deleteButton.addEventListener("click", () => {
      openModal(popupDelete); // Показываем попап подтверждения

      // ВАЖНО: вызываем функцию setDeleteCardCallback и передаём в неё колбэк
      setDeleteCardCallback(() => {
        deleteCardFromServer(cardData._id)
          .then(() => {
            cardElement.remove(); // Удаляем элемент из DOM
            closeModal(popupDelete); // Закрываем попап
          })
          .catch((err) => console.error("Ошибка при удалении карточки:", err));
      });
    });
  } else {
    deleteButton.remove();
  }

  // Лайки
  const isLikedByUser = cardData.likes.some((like) => like._id === userId);
  if (isLikedByUser) {
    likeButton.classList.add("card__like-button_active");
  }

  likeButton.addEventListener("click", () => {
    const isLiked = likeButton.classList.contains("card__like-button_active");
    const toggleLike = isLiked ? unlikeCard : likeCard;

    toggleLike(cardData._id)
      .then((updatedCard) => {
        likeCounter.textContent = updatedCard.likes.length;
        if (updatedCard.likes.some((like) => like._id === userId)) {
          likeButton.classList.add("card__like-button_active");
        } else {
          likeButton.classList.remove("card__like-button_active");
        }
      })
      .catch((err) => console.error(err));
  });

  cardImage.addEventListener("click", () => handleImageClick(cardData));

  return cardElement;
}
