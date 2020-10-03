/* eslint-disable object-property-newline */
import Api from './modules/Api.js';
import Card from './components/Card.js';
import CardList from './components/CardList.js';
import FormValidator from './components/FormValidator.js';
import PopupTypeForm from './components/PopupTypeForm.js';
import PopupTypeImage from './components/PopupTypeImage.js';
import UserInfo from './components/UserInfo.js';
import constants from './constants/index.js';

const initDomElements = () => {
  const popupCardContainer = document.querySelector('.popup_type_card');
  const popupInfoContainer = document.querySelector('.popup_type_info');
  const popupAvatarContainer = document.querySelector('.popup_type_avatar');
  const popupImageContainer = document.querySelector('.popup_type_image');
  const cardsContainer = document.querySelector('.places-list');

  const popupCardOpenButton = document.querySelector('.user-info__button_type_popup-card-open');
  const popupInfoOpenButton = document.querySelector('.user-info__button_type_popup-info-open');

  const { cardForm } = document.forms;
  const { infoForm } = document.forms;
  const { avatarForm } = document.forms;

  const userNameElement = document.querySelector('.user-info__name');
  const userAboutElement = document.querySelector('.user-info__job');
  const userAvatarElement = document.querySelector('.user-info__photo');

  return {
    popupCardContainer, popupInfoContainer, popupAvatarContainer, popupImageContainer,
    cardsContainer, popupCardOpenButton, popupInfoOpenButton, cardForm, infoForm, avatarForm,
    userNameElement, userAboutElement, userAvatarElement,
  };
};

const initInstances = (params) => {
  const {
    apiConfig, inputErrors, cardsContainer, userNameElement, userAboutElement,
    userAvatarElement, popupCardContainer, popupInfoContainer, popupImageContainer,
    popupAvatarContainer, cardForm, infoForm, avatarForm, makeResetFormCb,
  } = params;

  const api = new Api(apiConfig);
  const cardList = new CardList(cardsContainer);
  const userInfo = new UserInfo(userNameElement, userAboutElement, userAvatarElement);

  const popupCard = new PopupTypeForm(popupCardContainer, makeResetFormCb(cardForm, inputErrors));
  const popupInfo = new PopupTypeForm(popupInfoContainer, makeResetFormCb(infoForm, inputErrors));
  const popupAvatar = new PopupTypeForm(
    popupAvatarContainer, makeResetFormCb(avatarForm, inputErrors),
  );
  const popupTypeImage = new PopupTypeImage(popupImageContainer);

  return {
    api, cardList, userInfo, popupCard, popupInfo, popupAvatar, popupTypeImage,
  };
};

const makeRemoveCardCb = (api) => (card) => {
  const deleteConfirmation = window.confirm('Вы действительно хотите удалить карточку?');

  if (deleteConfirmation) {
    api.deleteCardData(card._cardData._id)
      .then(() => {
        card._deleteEventListeners();
        card._cardElement.remove();
      })
      .catch(console.log);
  }
};

const makeLikeCardCb = (api) => (card) => {
  if (card._likeElement.classList.contains('place-card__like-icon_liked')) {
    api.deleteLike(card._cardData._id)
      .then(({ likes }) => {
        card._likeCounter.textContent = likes.length;
      })
      .catch(console.log);
  } else {
    api.addLike(card._cardData._id)
      .then(({ likes }) => {
        card._likeCounter.textContent = likes.length;
      })
      .catch(console.log);
  }

  card._likeElement.classList.toggle('place-card__like-icon_liked');
};

const makeOpenPopupImageCb = (popupImage) => (card) => {
  popupImage.open(card._imageLink);
};

const makeCard = (cardData, userId, popupTypeImage, api) => {
  const card = new Card(
    cardData,
    userId,
    makeRemoveCardCb(api),
    makeLikeCardCb(api),
    makeOpenPopupImageCb(popupTypeImage),
  );

  return card.create();
};

const addCardIntoCardList = (cardList, cardData, userId, popupTypeImage, api) => cardList
  .addCard(makeCard(cardData, userId, popupTypeImage, api));

const setPopupEventListeners = (popup, openElement = null) => {
  if (openElement) {
    openElement.addEventListener('click', () => popup.open());
  }

  popup.setCloseListeners();
};

const makeResetFormCb = (formElement, errorsMessages) => {
  const formValidator = new FormValidator(formElement, errorsMessages);

  return () => formValidator.resetForm();
};

const cardFormSubmitHandler = (params) => {
  const {
    e, api, userId, cardList, popupTypeImage, popupCard, cardForm,
  } = params;
  e.preventDefault();

  const { cardName: cardNameInput, link: linkInput, submit: submitButton } = cardForm.elements;
  const submitButtonText = submitButton.textContent;
  submitButton.textContent = 'Загрузка...';

  api.addCardData(cardNameInput.value, linkInput.value)
    .then((cardData) => {
      addCardIntoCardList(cardList, cardData, userId, popupTypeImage, api);
    })
    .catch(console.log)
    .finally(() => {
      popupCard.close();
      submitButton.textContent = submitButtonText;
    });
};

const infoFormSubmitHandler = (params) => {
  const {
    e, api, userInfo, popupInfo, infoForm,
  } = params;
  e.preventDefault();

  const { name: nameInput, about: aboutInput, submit } = infoForm.elements;
  const submitButtonText = submit.textContent;
  submit.textContent = 'Загрузка...';

  api.saveUserData(nameInput.value, aboutInput.value)
    .then(({ name, about }) => {
      userInfo.setUserInfo(name, about);
      userInfo.updateUserInfo();
      nameInput.defaultValue = name;
      aboutInput.defaultValue = about;
    })
    .catch(console.log)
    .finally(() => {
      popupInfo.close();
      submit.textContent = submitButtonText;
    });
};

const avatarFormSubmitHandler = (params) => {
  const {
    e, api, userInfo, popupAvatar, avatarForm,
  } = params;
  e.preventDefault();

  const { link: linkInput, submit } = avatarForm.elements;
  const submitButtonText = submit.textContent;
  submit.textContent = 'Загрузка...';

  api.updateAvatar(linkInput.value)
    .then((response) => {
      userInfo.setUserAvatar(response.avatar);
      userInfo.updateUserAvatar();
    })
    .catch(console.log)
    .finally(() => {
      popupAvatar.close();
      submit.textContent = submitButtonText;
    });
};

const renderInitCards = (params) => {
  const {
    api, state, userInfo, popupTypeImage, cardList, infoForm,
  } = params;
  const { name: nameInput, about: aboutInput } = infoForm.elements;

  api.getAppData()
    .then(([userData, initialCardsData]) => {
      state.userData = userData;

      nameInput.defaultValue = userData.name;
      aboutInput.defaultValue = userData.about;

      userInfo.setUserInfo(userData.name, userData.about);
      userInfo.setUserAvatar(userData.avatar);
      userInfo.updateUserInfo();
      userInfo.updateUserAvatar();

      const initialCards = initialCardsData.map((cardData) => makeCard(
        cardData, userData._id, popupTypeImage, api,
      ));

      cardList.render(initialCards);
    })
    .catch(console.log);
};

export default () => {
  const state = {
    userData: {},
  };

  const domElements = initDomElements();
  const {
    popupCardOpenButton, popupInfoOpenButton, userAvatarElement,
    cardForm, infoForm, avatarForm,
  } = domElements;
  const {
    api, cardList, userInfo, popupCard, popupInfo, popupAvatar, popupTypeImage,
  } = initInstances({ ...constants, ...domElements, makeResetFormCb });

  setPopupEventListeners(popupCard, popupCardOpenButton);
  setPopupEventListeners(popupInfo, popupInfoOpenButton);
  setPopupEventListeners(popupAvatar, userAvatarElement);
  setPopupEventListeners(popupTypeImage);
  cardForm.addEventListener('submit', (e) => cardFormSubmitHandler({
    e, api, userId: state.userData._id, cardList, popupTypeImage, popupCard, cardForm,
  }));
  infoForm.addEventListener('submit', (e) => infoFormSubmitHandler({
    e, api, userInfo, popupInfo, infoForm,
  }));
  avatarForm.addEventListener('submit', (e) => avatarFormSubmitHandler({
    e, api, userInfo, popupAvatar, avatarForm,
  }));
  renderInitCards({
    api, state, userInfo, popupTypeImage, cardList, infoForm,
  });
};
