import Api from './modules/Api.js';
import Card from './modules/Card.js';
import CardList from './modules/CardList.js';
import FormValidator from './modules/FormValidator.js';
import PopupTypeForm from './modules/PopupTypeForm.js';
import PopupTypeImage from './modules/PopupTypeImage.js';
import UserInfo from './modules/UserInfo.js';

import './index.css';

const runApp = () => {
  const state = {
    userData: {},
  };

  const apiConfig = {
    // eslint-disable-next-line no-undef
    baseUrl: NODE_ENV === 'development'
      ? 'http://praktikum.tk/cohort11'
      : 'https://praktikum.tk/cohort11',
    headers: {
      authorization: '865d3e91-8ce0-4f86-8f6b-42dbb43992fc',
      'Content-Type': 'application/json',
    },
  };

  const inputErrors = {
    url: 'Здесь должна быть ссылка',
    requiredField: 'Это обязательное поле',
    shortOrLong: 'Должно быть от 2 до 30 символов',
  };

  // DOM-элементы
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
  const { name: nameInput, about: aboutInput, submit: submitInfoButton } = infoForm.elements;

  const userNameElement = document.querySelector('.user-info__name');
  const userAboutElement = document.querySelector('.user-info__job');
  const userAvatarElement = document.querySelector('.user-info__photo');

  // Функции
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

  // Экземпляры классов
  const api = new Api(apiConfig);
  const cardList = new CardList(cardsContainer);
  const userInfo = new UserInfo(userNameElement, userAboutElement, userAvatarElement);

  const popupCard = new PopupTypeForm(popupCardContainer, makeResetFormCb(cardForm, inputErrors));
  const popupInfo = new PopupTypeForm(popupInfoContainer, makeResetFormCb(infoForm, inputErrors));
  const popupAvatar = new PopupTypeForm(
    popupAvatarContainer, makeResetFormCb(avatarForm, inputErrors),
  );
  const popupTypeImage = new PopupTypeImage(popupImageContainer);

  // Обработчики
  const cardFormSubmitHandler = (event) => {
    event.preventDefault();

    const { cardName: cardNameInput, link: linkInput, submit: submitButton } = cardForm.elements;
    const submitButtonText = submitButton.textContent;
    submitButton.textContent = 'Загрузка...';

    api.addCardData(cardNameInput.value, linkInput.value)
      .then((cardData) => {
        addCardIntoCardList(cardList, cardData, state.userData._id, popupTypeImage, api);
      })
      .catch(console.log)
      .finally(() => {
        popupCard.close();
        submitButton.textContent = submitButtonText;
      });
  };

  const infoFormSubmitHandler = (event) => {
    event.preventDefault();

    const submitButtonText = submitInfoButton.textContent;
    submitInfoButton.textContent = 'Загрузка...';

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
        submitInfoButton.textContent = submitButtonText;
      });
  };

  const avatarFormSubmitHandler = (event) => {
    event.preventDefault();

    const { link: linkInput, submit: submitButton } = avatarForm.elements;
    const submitButtonText = submitButton.textContent;
    submitButton.textContent = 'Загрузка...';

    api.updateAvatar(linkInput.value)
      .then((response) => {
        userInfo.setUserAvatar(response.avatar);
        userInfo.updateUserAvatar();
      })
      .catch(console.log)
      .finally(() => {
        popupAvatar.close();
        submitButton.textContent = submitButtonText;
      });
  };

  // Слушатели
  setPopupEventListeners(popupCard, popupCardOpenButton);
  setPopupEventListeners(popupInfo, popupInfoOpenButton);
  setPopupEventListeners(popupAvatar, userAvatarElement);
  setPopupEventListeners(popupTypeImage);

  cardForm.addEventListener('submit', cardFormSubmitHandler);
  infoForm.addEventListener('submit', infoFormSubmitHandler);
  avatarForm.addEventListener('submit', avatarFormSubmitHandler);

  // Инициализация стартовых данных юзера и стартовых карточек.
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

runApp();
