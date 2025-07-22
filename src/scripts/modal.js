// Функция открытия модального окна
export function openModal(modal) {
  modal.classList.add("popup_is-opened");
  document.addEventListener("keydown", closeByEsc);
}

// Функция закрытия модального окна
export function closeModal(modal) {
  modal.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closeByEsc);
}

// Функция-обработчик события нажатия Esc
export function closeByEsc(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) closeModal(openedPopup);
  }
}

// Функция-обработчик события клика по оверлею
export function setOverlayCloseHandlers() {
  document.querySelectorAll(".popup").forEach((popup) => {
    popup.addEventListener("mousedown", (evt) => {
      if (evt.target === popup) {
        closeModal(popup);
      }
    });
  });
}

// Универсальная функция renderSaving
export function renderSaving(
  isSaving,
  buttonElement,
  defaultText = "Сохранить"
) {
  buttonElement.textContent = isSaving ? "Сохранение..." : defaultText;
}
