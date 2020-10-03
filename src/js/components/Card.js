class Card {
  constructor(cardData, userId, removeCardCb, likeCardCb, openPopupImageCb) {
    this._cardData = cardData;
    this._userId = userId;

    this._removeCardCb = removeCardCb;
    this._likeCardCb = likeCardCb;
    this._openPopupImageCb = openPopupImageCb;
  }

  _isLikedBefore() {
    return this._cardData.likes.some(({ _id }) => this._userId === _id);
  }

  create() {
    const cardContentMarkup = `
      <div class="place-card__image-container">
        <img class="place-card__image" src="">
        <button class="place-card__delete-icon"></button>
      </div>
      <div class="place-card__description">
        <h3 class="place-card__name">Card name</h3>
        <div class="place-card__likes-container">
          <button class="place-card__like-icon"></button>
          <span class="place-card__like-counter"></span>
        </div>
      </div>
    `;

    const cardContainer = document.createElement('div');
    cardContainer.classList.add('place-card');
    cardContainer.insertAdjacentHTML('afterbegin', cardContentMarkup);

    const imageElement = cardContainer.querySelector('.place-card__image');
    imageElement.setAttribute('src', this._cardData.link);

    const cardNameElement = cardContainer.querySelector('.place-card__name');
    cardNameElement.textContent = this._cardData.name;

    this._cardElement = cardContainer;
    this._likeElement = cardContainer.querySelector('.place-card__like-icon');

    if (this._isLikedBefore()) {
      this._likeElement.classList.add('place-card__like-icon_liked');
    }

    this._likeCounter = cardContainer.querySelector('.place-card__like-counter');
    this._likeCounter.textContent = this._cardData.likes.length;
    this._trashElement = cardContainer.querySelector('.place-card__delete-icon');
    this._trashElement.style.display = this._cardData.owner._id === this._userId
      ? 'block' : 'none';
    this._popupOpenElement = cardContainer.querySelector('.place-card__image-container');
    this._imageLink = imageElement.getAttribute('src');

    this._setEventListeners();

    return cardContainer;
  }

  _removeHandler() {
    this._removeCardCb(this);
  }

  _likeHandler() {
    this._likeCardCb(this);
  }

  _openPopupHandler(event) {
    if (event.target !== this._trashElement) {
      this._openPopupImageCb(this);
    }
  }

  _setEventListeners() {
    this._boundRemoveHanler = this._removeHandler.bind(this);
    this._boundLikeHanler = this._likeHandler.bind(this);
    this._boundOpenPopupHandler = this._openPopupHandler.bind(this);

    this._trashElement.addEventListener('click', this._boundRemoveHanler);
    this._likeElement.addEventListener('click', this._boundLikeHanler);
    this._popupOpenElement.addEventListener('click', this._boundOpenPopupHandler);
  }

  _deleteEventListeners() {
    this._trashElement.removeEventListener('click', this._boundRemoveHanler);
    this._likeElement.removeEventListener('click', this._boundLikeHanler);
    this._popupOpenElement.removeEventListener('click', this._boundOpenPopupHandler);
  }
}

export default Card;
