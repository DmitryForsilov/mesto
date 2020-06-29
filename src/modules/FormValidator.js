
class FormValidator {
  constructor(formElement, errors) {
    this._formElement = formElement;
    this._submitButton = formElement.elements.submit;
    this._errorElements = this._formElement.querySelectorAll('.popup__error-message');
    this._erorrs = errors;

    this._setEventListeners();
  }

  _isFormValid() {
    return this._formElement.checkValidity();
  }

  _checkInputValidity(inputElement, errorElement) {
    const validityState = inputElement.validity;

    if (validityState.typeMismatch) {
      errorElement.textContent = this._erorrs[inputElement.type];

      return false;
    }
    if (validityState.valueMissing) {
      errorElement.textContent = this._erorrs.requiredField;

      return false;
    }
    if (validityState.tooShort || validityState.tooLong) {
      errorElement.textContent = this._erorrs.shortOrLong;

      return false;
    }

    errorElement.textContent = '';

    return true;
  }

  _enableSubmitButton() {
    this._submitButton.removeAttribute('disabled');
    this._submitButton.classList.remove('popup__button_disabled');
  }

  _disableSubmitButton() {
    this._submitButton.setAttribute('disabled', true);
    this._submitButton.classList.add('popup__button_disabled');
  }

  _setSubmitButtonState() {
    if (this._isFormValid()) {
      this._enableSubmitButton();
    } else {
      this._disableSubmitButton();
    }
  }

  resetForm() {
    this._errorElements.forEach((element) => {
      element.textContent = '';
    });

    this._formElement.reset();
    this._disableSubmitButton();
  }

  _validateHandler(event) {
    const inputElement = event.target;
    const inputContainer = inputElement.closest('.popup__input-container');
    const errorElement = inputContainer.querySelector('.popup__error-message');

    this._checkInputValidity(inputElement, errorElement);
    this._setSubmitButtonState();
  }

  _setEventListeners() {
    this.boundValidateHandler = this._validateHandler.bind(this);

    this._formElement.addEventListener('input', this.boundValidateHandler);
  }
}
