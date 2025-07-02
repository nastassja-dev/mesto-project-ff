  // @todo: Темплейт карточки
  const cardTemplate = document.querySelector('#card-template').content;

  // Функция создания карточки
export function createCard(cardData, handleDelete, handleLikeCard, handleImageClick) {
  // клонирование шаблона карточки
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  // Установка значений
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Обработчик удаления карточки
  const deleteButton = cardElement.querySelector('.card__delete-button');
  deleteButton.addEventListener('click', () => handleDelete(cardElement));

  // Обработчик лайка
  const likeButton = cardElement.querySelector('.card__like-button');
  likeButton.addEventListener('click', () => handleLikeCard(likeButton));

  // Обработчик клика по картинке
  cardImage.addEventListener('click', () => {
    handleImageClick(cardData);
  });

  return cardElement;
}