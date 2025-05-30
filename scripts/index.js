// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const placesList = document.querySelector('.places__list');

// @todo: Функция создания карточки
function createCard(cardData, handleDelete) {
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

  return cardElement;
}

// @todo: Функция удаления карточки
function handleDeleteCard(cardElement) {
  cardElement.remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach(cardData => {
  const card = createCard(cardData, handleDeleteCard);
  placesList.append(card);
});