class Popup {
  constructor(container) {
    this._container = container;
    this._closeElement = this._container.querySelector('.popup__close');
  }

  open() {
    this._container.classList.add('popup_is-opened');
  }

  close() {
    this._container.classList.remove('popup_is-opened');
  }

  setCloseListeners() {
    this._boundCloseHandler = this.close.bind(this);
    this._closeElement.addEventListener('click', this._boundCloseHandler);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this._boundCloseHandler();
      }
    });

    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('popup_is-opened')) {
        this._boundCloseHandler();
      }
    });
  }
}

export default Popup;
