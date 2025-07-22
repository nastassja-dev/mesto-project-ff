const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-42",
  headers: {
    authorization: "b73a31e5-1a23-48b6-a499-ce16861d0b6e",
    "Content-Type": "application/json",
  },
};

export function checkResponse(res) {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
}

export function getUserInfo() {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: {
      authorization: "b73a31e5-1a23-48b6-a499-ce16861d0b6e",
    },
  }).then(checkResponse);
}

export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    // если ошибка, отклоняем промис
    return Promise.reject(`Ошибка: ${res.status}`);
  });
};

export function updateUserInfo({ name, about }) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers, // включает и authorization, и Content-Type
    body: JSON.stringify({ name, about }),
  }).then(checkResponse);
}

export function addNewCard({ name, link }) {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({ name, link }),
  }).then(checkResponse);
}

export function deleteCard(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(checkResponse);
}

// поставить лайк
export function likeCard(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: config.headers,
  }).then(checkResponse);
}

// убрать лайк
export function unlikeCard(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(checkResponse);
}

export function deleteCardFromServer(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((err) => {
        console.error(
          `Ошибка удаления карточки ${cardId}:`,
          err.message || err
        );
        throw new Error(`Ошибка ${res.status}: ${err.message}`);
      });
    }
    return res.json();
  });
}

export function updateAvatar(avatarUrl) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: {
      authorization: config.headers.authorization,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ avatar: avatarUrl }),
  }).then(checkResponse);
}
