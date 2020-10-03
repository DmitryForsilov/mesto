export default {
  // eslint-disable-next-line no-undef
  baseUrl: NODE_ENV === 'development'
    ? 'http://nomoreparties.co/cohort11'
    : 'https://nomoreparties.co/cohort11',
  headers: {
    authorization: '865d3e91-8ce0-4f86-8f6b-42dbb43992fc',
    'Content-Type': 'application/json',
  },
};
