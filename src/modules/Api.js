
class Api {
  constructor(config) {
    this._baseUrl = config.baseUrl;
    this._headers = config.headers;
  }

  static async makeRequest(url, options) {
    const response = await fetch(url, options);

    if (response.ok) {
      return response.json();
    }

    return Promise.reject(Error(`Error: ${response.status} ${response.statusText}`));
  }

  _getUserData() {
    return this.constructor.makeRequest(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    });
  }

  _getInitialCardsData() {
    return this.constructor.makeRequest(`${this._baseUrl}/cards`, {
      headers: this._headers,
    });
  }

  getAppData() {
    return Promise.all([this._getUserData(), this._getInitialCardsData()]);
  }

  saveUserData(name, about) {
    return this.constructor.makeRequest(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    });
  }

  addCardData(name, link) {
    return this.constructor.makeRequest(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    });
  }

  deleteCardData(cardId) {
    return this.constructor.makeRequest(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
    });
  }

  addLike(cardId) {
    return this.constructor.makeRequest(`${this._baseUrl}/cards/like/${cardId}`, {
      method: 'PUT',
      headers: this._headers,
    });
  }

  deleteLike(cardId) {
    return this.constructor.makeRequest(`${this._baseUrl}/cards/like/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
    });
  }

  updateAvatar(link) {
    return this.constructor.makeRequest(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: link,
      }),
    });
  }
}
