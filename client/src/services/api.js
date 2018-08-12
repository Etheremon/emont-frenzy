export const DOMAIN = 'https://www.emonteam.com';


export const getUserFish = (userId) => {
  return new Promise(function(resolve, reject) {
    window.LoadDataWithRpcCheck(() => {window.getPlayerFish(userId, getCallbackFunc(resolve, reject))});
  });
};

export const getUserLog = (userId) => {
  return new Promise(function(resolve, reject) {
    window.LoadDataWithRpcCheck(() => {window.getLatestLog(userId, getCallbackFunc(resolve, reject))});
  });
};

export const getBaseFishes = () => {
  return new Promise(function(resolve, reject) {
    window.LoadDataWithRpcCheck(() => {window.getBaseFishes(getCallbackFunc(resolve, reject))});
  });
};


/**
 * Callback Function => Call Promise
 * @param resolve
 * @param reject
 * @returns {Function}
 */
const getCallbackFunc = (resolve, reject) => {
  return function(code, data) {
    switch (code) {
      case window.RESULT_CODE.SUCCESS:
        resolve({response: data});
        break;

      default:
        resolve({error: data});
    }
  }
};

const sendGetRequest = ({url, resolve, reject}) => {
  return $.get(url)
    .done(function(data) {
      resolve({response: data});
    })
    .fail(function(err) {
      reject({error: err});
    })
};