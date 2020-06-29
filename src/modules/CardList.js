
class CardList {
  constructor(container) {
    this._container = container;
  }

  addCard(cardElement) {
    this._container.appendChild(cardElement);
  }

  render(initialCards) {
    initialCards.forEach((cardElement) => this.addCard(cardElement));
  }
}
