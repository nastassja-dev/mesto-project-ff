// index.js

import '../pages/index.css'; // добавьте импорт главного файла стилей 

import logoPath from '../images/logo.svg';
import avatarPath from '../images/avatar.jpg';
import { initialCards } from './cards.js';
import { createCard } from './card.js';
import { openModal, closeModal, closeByEsc, setOverlayCloseHandlers } from './modal.js';

const logo = document.getElementById('logo');
if (logo) logo.src = logoPath;

const avatar = document.getElementById('avatar');
if (avatar) avatar.style.backgroundImage = `url(${avatarPath})`;

// DOM узлы
const placesList = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const imageList = document.querySelector('.places__list');
const editPopup = document.querySelector('.popup_type_edit');
const addPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');
const closeButtons = document.querySelectorAll('.popup__close');
const editProfileForm = document.querySelector('.popup_type_edit .popup__form');
const nameInput = editProfileForm.querySelector('.popup__input_type_name');
const jobInput = editProfileForm.querySelector('.popup__input_type_description');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const addCardForm = document.querySelector('.popup_type_new-card .popup__form');
const cardNameInput = addCardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = addCardForm.querySelector('.popup__input_type_url');

setOverlayCloseHandlers();

// Функция удаления карточки
function handleDeleteCard(cardElement) {
  cardElement.remove();
}

// Функция обработчика лайка
function handleLikeCard(likeButton) {
  likeButton.classList.toggle('card__like-button_active');
}

// Функция обработчика клика по картинке карточки
function handleImageClick(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openModal(imagePopup);
}

// Вывести карточки на страницу
initialCards.forEach(cardData => {
  const card = createCard(cardData, handleDeleteCard, handleLikeCard, handleImageClick);
  placesList.append(card);
});

// Обработчик добавления новой карточки
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const newCardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value
  };
  const newCard = createCard(newCardData, handleDeleteCard, handleLikeCard, handleImageClick);
  placesList.prepend(newCard);
  closeModal(addPopup);
  addCardForm.reset();
}
addCardForm.addEventListener('submit', handleAddCardSubmit);

// Открытие попапа редактирования профиля
editButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(editPopup);
});

// Обработчик отправки формы редактирования профиля
function handleFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(editPopup);
}
editProfileForm.addEventListener('submit', handleFormSubmit);

// Обработчик открытия попапа добавления карточки
addButton.addEventListener('click', () => openModal(addPopup));

// Закрытие по крестику
closeButtons.forEach((button) => {
  button.addEventListener('click', (evt) => {
    const popup = evt.target.closest('.popup');
    closeModal(popup);
  });
});
