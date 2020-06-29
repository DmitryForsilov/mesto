
class PopupTypeForm extends Popup {
  constructor(container, resetFormCb) {
    super(container);

    this._resetFormCb = resetFormCb;
  }

  close() {
    super.close();
    this._resetFormCb();
  }
}
