
class UserInfo {
  constructor(userNameElement, userAboutElement, userAvatarElement) {
    this._userNameElement = userNameElement;
    this._userAboutElement = userAboutElement;
    this._userAvatarElement = userAvatarElement;

    this._name = this._userNameElement.textContent;
    this._about = this._userAboutElement.textContent;
    this._avatarLink = this._userAvatarElement.textContent;
  }

  setUserInfo(newName, newAbout) {
    this._name = newName;
    this._about = newAbout;
  }

  setUserAvatar(link) {
    this._avatarLink = link;
  }

  updateUserInfo() {
    this._userNameElement.textContent = this._name;
    this._userAboutElement.textContent = this._about;
  }

  updateUserAvatar() {
    this._userAvatarElement.style.backgroundImage = `url(${this._avatarLink})`;
  }
}
