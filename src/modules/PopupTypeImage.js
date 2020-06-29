
class PopupTypeImage extends Popup {
  constructor(container) {
    super(container);

    this._imageElement = container.querySelector('.popup__image');
  }

  _insertImage(imageLink) {
    this._imageElement.setAttribute('src', imageLink);
  }

  _removeImage() {
    this._imageElement.setAttribute('src', '');
  }

  open(imageLink) {
    this._insertImage(imageLink);
    super.open();
  }

  close() {
    super.close();
    this._removeImage();
  }
}
