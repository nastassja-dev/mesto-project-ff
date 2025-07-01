// index.js

import '../pages/index.css'; // добавьте импорт главного файла стилей 

import logoPath from '../images/logo.svg';
import avatarPath from '../images/avatar.jpg';
import { initialCards } from './cards.js';

document.addEventListener('DOMContentLoaded', () => {
  const logo = document.getElementById('logo');
  if (logo) logo.src = logoPath;

  const avatar = document.getElementById('avatar');
  if (avatar) avatar.style.backgroundImage = `url(${avatarPath})`;

  // @todo: Темплейт карточки
  const cardTemplate = document.querySelector('#card-template').content;
  
  // @todo: DOM узлы
  const placesList = document.querySelector('.places__list');
  
  // @todo: Функция создания карточки
  function createCard(cardData, handleDelete, handleLikeCard) {
  
    // рекомендована после ревью стрелочная функция
    const handleMouseEnter = (event) => {
      const text = event.target.textContent;
      event.target.title = text.length;
  } 
  
    // клонирование шаблона карточки
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  
    // установка значений
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;
  
    // обработчик удаления карточек
    const deleteButton = cardElement.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', () => handleDelete(cardElement));

    // обработчик лайка
    const likeButton = cardElement.querySelector('.card__like-button');
    likeButton.addEventListener('click', () => handleLikeCard(likeButton));
  
    return cardElement;
  }
  
  // @todo: Функция удаления карточки
  function handleDeleteCard(cardElement) {
    cardElement.remove();
  }

  // Функция обработчика лайка
  function handleLikeCard(likeButton) {
    console.log('like clicked');
    likeButton.classList.toggle('card__like-button_active');
  }
  
  // @todo: Вывести карточки на страницу
  initialCards.forEach(cardData => {
    const card = createCard(cardData, handleDeleteCard, handleLikeCard);
    placesList.append(card);
  });
  
  // Модальные окна
  
  // Функция открытия модального окна
function openModal(modal) {
  modal.classList.add('popup_is-opened');

  // Добавляем обработчик Esc только при открытии
  function handleEscClose(evt) {
    if (evt.key === 'Escape') {
      closeModal(modal);
    }
  }
  // Сохраняем обработчик в свойство DOM-элемента, чтобы потом удалить
  modal._handleEscClose = handleEscClose;
  document.addEventListener('keydown', handleEscClose);
}
  
  // Функция закрытия модального окна
function closeModal(modal) {
  modal.classList.remove('popup_is-opened');
  // Удаляем обработчик Esc при закрытии
  if (modal._handleEscClose) {
    document.removeEventListener('keydown', modal._handleEscClose);
    modal._handleEscClose = null;
  }
}
  
  // Добавляем обработчик на все попапы
  document.querySelectorAll('.popup').forEach((popup) => {
    popup.addEventListener('mousedown', (evt) => {
      // Если клик был по самому попапу (оверлею), а не по содержимому
      if (evt.target === popup) {
        closeModal(popup);
      }
    });
  });
  
  // Получаем все нужные элементы
  const editButton = document.querySelector('.profile__edit-button');
  const addButton = document.querySelector('.profile__add-button');
  const imageList = document.querySelector('.places__list');
  const editPopup = document.querySelector('.popup_type_edit');
  const addPopup = document.querySelector('.popup_type_new-card');
  const imagePopup = document.querySelector('.popup_type_image');
  const popupImage = imagePopup.querySelector('.popup__image');
  const popupCaption = imagePopup.querySelector('.popup__caption');
  
  // Кнопки закрытия (крестики)
  const closeButtons = document.querySelectorAll('.popup__close');

  // Находим форму и поля формы
const editProfileForm = document.querySelector('.popup_type_edit .popup__form');
const nameInput = editProfileForm.querySelector('.popup__input_type_name');
const jobInput = editProfileForm.querySelector('.popup__input_type_description');

// Находим элементы профиля на странице
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// Открытие попапа редактирования профиля
editButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(editPopup);
});

// Обработчик отправки формы
function handleFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(editPopup);
}

// Навешиваем обработчик на форму
editProfileForm.addEventListener('submit', handleFormSubmit);

// Находим форму и поля для новой карточки
const addCardForm = document.querySelector('.popup_type_new-card .popup__form');
const cardNameInput = addCardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = addCardForm.querySelector('.popup__input_type_url');

// Обработчик отправки формы добавления карточки
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const newCardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value
  };
  const newCard = createCard(newCardData, handleDeleteCard, handleLikeCard);
  placesList.prepend(newCard); // Добавляем в начало
  closeModal(addPopup);        // Закрываем попап
  addCardForm.reset();         // Очищаем форму
}
addCardForm.addEventListener('submit', handleAddCardSubmit);
  
  // Открытие по кнопкам
  editButton.addEventListener('click', () => openModal(editPopup));
  addButton.addEventListener('click', () => openModal(addPopup));
  // Делегирование на список карточек
imageList.addEventListener('click', (evt) => {
  if (evt.target.classList.contains('card__image')) {
    // Подставляем данные в попап
    popupImage.src = evt.target.src;
    popupImage.alt = evt.target.alt;
    popupCaption.textContent = evt.target.alt;
    openModal(imagePopup);
  }
});
  
  // Закрытие по крестику
  closeButtons.forEach((button) => {
    button.addEventListener('click', (evt) => {
      const popup = evt.target.closest('.popup');
      closeModal(popup);
    });
  });
});

console.log('Hello, World!')

const numbers = [2, 3, 5];

// Стрелочная функция. Не запнётся ли на ней Internet Explorer?
const doubledNumbers = numbers.map(number => number * 2);

console.log(doubledNumbers); // 4, 6, 10
