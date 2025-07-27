export function createCard({
  cardData,
  userId,
  templateElement,
  handleImageClick,
  handleDeleteClick,
  handleLikeToggle,
}) {
  const cardElement = templateElement.querySelector(".card").cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  const { name, link, likes = [], _id: cardId, owner } = cardData;

  cardTitle.textContent = name;
  cardImage.src = link;
  cardImage.alt = name;
  likeCount.textContent = likes.length;

  // Проверка, ставил ли лайк текущий пользователь
  const isLiked = likes.some((like) => like._id === userId);
  if (isLiked) {
    likeButton.classList.add("card__like-button_active");
  }

  // Проверка, владелец ли текущий пользователь
  const isOwner = owner && owner._id === userId;
  if (!isOwner) {
    deleteButton.remove();
  }

  // Обработчик клика по изображению
  cardImage.addEventListener("click", () => handleImageClick({ name, link }));

  // Обработчик удаления
  if (isOwner) {
    deleteButton.addEventListener("click", () => {
      handleDeleteClick(cardElement, cardId);
    });
  }

  // Обработчик лайка
  likeButton.addEventListener("click", () => {
    const liked = likeButton.classList.contains("card__like-button_active");
    handleLikeToggle(cardId, liked)
      .then((updatedCard) => {
        likeCount.textContent = updatedCard.likes.length;
        likeButton.classList.toggle("card__like-button_active");
      })
      .catch(console.error);
  });

  return cardElement;
}
