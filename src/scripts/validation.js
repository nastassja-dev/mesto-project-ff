function showInputError(formElement, inputElement, errorMessage, config) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(config.inputErrorClass);
  inputElement.dataset.error = errorMessage;
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
}

function hideInputError(formElement, inputElement, config) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.textContent = "";
  errorElement.classList.remove(config.errorClass);
  delete inputElement.dataset.error;
}

function checkInputValidity(formElement, inputElement, config) {
  const isTouched = inputElement.dataset.touched === "true";

  if (inputElement.validity.patternMismatch) {
    if (isTouched) {
      const errorMessage =
        inputElement.dataset.errorMessage || inputElement.validationMessage;
      showInputError(formElement, inputElement, errorMessage, config);
    } else {
      hideInputError(formElement, inputElement, config);
    }
    return false;
  }

  // Для остальных случаев — стандартное сообщение браузера
 if (!inputElement.validity.valid) {
    if (isTouched) {
      showInputError(
        formElement,
        inputElement,
        inputElement.validationMessage,
        config
      );
    } else {
      hideInputError(formElement, inputElement, config);
    }
    return false;
  }

  hideInputError(formElement, inputElement, config);
  return true;
}

function toggleButtonState(inputs, buttonElement, formElement, config) {
  const isFormValid = inputs.every((input) =>
    checkInputValidity(formElement, input, config)
  );
  if (isFormValid) {
    buttonElement.disabled = false;
  } else {
    buttonElement.disabled = true;
  }
}

function setEventListeners(formElement, config) {
  const inputs = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputs.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      if (inputElement.value.trim() !== "") {
        inputElement.dataset.touched = "true";
      }
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputs, buttonElement, formElement, config);
    });
  });

  // Не вызываем checkInputValidity при инициализации
  toggleButtonState(inputs, buttonElement, formElement, config);
}

function enableValidation(config) {
  const forms = Array.from(document.querySelectorAll(config.formSelector));
  forms.forEach((form) => {
    setEventListeners(form, config);
  });
}

function clearValidation(formElement, config) {
  const inputs = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputs.forEach((input) => {
    input.dataset.touched = "false";
    hideInputError(formElement, input, config);
  });
  toggleButtonState(inputs, buttonElement, formElement, config);
}

export { enableValidation, clearValidation };

// Функция HEAD-запроса для проверки изображения
export function isImageUrlValid(url) {
  return fetch(url, { method: "HEAD" })
    .then((response) => {
      const contentType = response.headers.get("Content-Type");
      return response.ok && contentType && contentType.startsWith("image/");
    })
    .catch(() => false);
}
