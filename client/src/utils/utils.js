import isEqual from 'lodash/isEqual'


export const CutoffString = (s, p) => (!s || s.length <= p ? s : `${s.substr(0, p)}...`);

export const MergeObjects = (a, b) => {
  for (let i in b)
    if (b.hasOwnProperty(i))
      a[i] = b[i];
  return a;
};

export const ConvertUnixToDateTime = (unixTime) => ((new Date(unixTime * 1000)).toLocaleDateString());

export const GetSumOfObjArray = (arr, key) => (arr.reduce((total, e) => (total + ((e && e[key]) || 0)), 0));

export const RoundToDecimal = (num, numRound) => (parseFloat(num.toFixed(numRound)).toString());

export const AddHeadingZero = (num, len) => {
  let str = '' + num;
  while (str.length < len) str = '0' + str;
  return str;
};

/**
 * Time Utils
 */
export const GetCurrentUnixTime = () => Math.floor(Date.now() / 1000);

export const FormatUnixTime = (unixTime) => {
  let hours = Math.floor(unixTime / 60 / 60);
  let minutes = Math.floor((unixTime - hours * 60 * 60) / 60);
  let seconds = Math.floor(unixTime - hours * 60 * 60 - minutes * 60);
  return `${hours} : ${minutes} : ${seconds}`
};

export const ExtractUnixTime = (unixTime) => {
  let days = Math.floor(unixTime / 60 / 60 / 24);
  let hours = Math.floor((unixTime - days * 24 * 60 * 60) / 60 / 60);
  let minutes = Math.floor((unixTime - days * 24 * 60 * 60 - hours * 60 * 60) / 60);
  let seconds = Math.floor(unixTime - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60);
  return {days, hours, minutes, seconds};
};

export const CalculateExtraGen0Stats = (create_index, earned, class_id) => {
  if (!window.GEN0_CONFIG[class_id]) return {num_eggs: 0};

  let price_origin = window.GEN0_CONFIG[class_id]['price'];
  let price_return = window.GEN0_CONFIG[class_id]['return'];
  let total_bought = window.GEN0_CONFIG[class_id]['total'];

  let catchPrice = undefined;
  let numEarlyBirds = Math.round(price_origin / price_return);

  // Catch Price
  if (create_index <= numEarlyBirds) catchPrice = price_origin;
  else catchPrice = price_origin + price_return * (create_index - numEarlyBirds);
  catchPrice = RoundToDecimal(catchPrice, 6);

  // Average Bought Price
  let averagePrice;
  if (total_bought <= numEarlyBirds)
    averagePrice = price_origin;
  else {
    let lateBirds = total_bought - numEarlyBirds;
    averagePrice = (total_bought * price_origin + price_return * lateBirds * (lateBirds + 1) / 2) / total_bought;
  }

  // Num Eggs
  let numEggs = Math.max(0, Math.ceil(1.5 * (catchPrice - earned) / averagePrice));

  // Special Case
  if ([20, 21].includes(class_id)) numEggs = 0;

  return {
    catch_price: catchPrice,
    num_eggs: numEggs,
    // num_eggs: 2,
  };
};

export const ScrollTop = () => {
  window.scroll(0, 0)
};

export const ToJS = (immutableObj) => (immutableObj && immutableObj.toJS ? immutableObj.toJS() : immutableObj);


/**
 * Array Utils
 */
export const ArrayCalAverage = arr => arr.reduce((p, c) => p + c, 0) / arr.length;


/**
 * Object Utils
 */
export const ObjFilter = (obj, func) => {
  let result = {};
  Object.keys(obj).forEach((key) => {
    if (func(obj[key])) result[key] = obj[key];
  });
  return result;
};

export const ObjGetValues = (obj) => {
  return typeof(obj) === 'object' && obj !== null ? Object.keys(obj).map(key => obj[key]) : obj;
};

export const ObjIsEmpty = (obj) => (!Object.keys(obj).length);

export const ObjIsEqual = (obj1, obj2) => (isEqual(obj1, obj2));

/**
 * Metamask & Web3 related
 */
export const HasMetamaskInstalled = () => (!!window.hasMetamaskInstalled);
export const HasMetamaskLoggedIn = () => (!!window.account);

/**
 * Url, Query related
 */

export const ParseQueryString = (searchStr) => {
  let vars = searchStr.substring(1).split('&');
  let res = {};
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=');
    res[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return res;
};

/**
 * sites
 */
export const IsChrome = navigator.userAgent.indexOf('Chrome') > -1;
export const IsIE = navigator.userAgent.indexOf('MSIE') > -1;
export const IsFirefox = navigator.userAgent.indexOf('Firefox') > -1;
export const IsSafari = IsChrome && navigator.userAgent.indexOf("Safari") > -1 ? false : navigator.userAgent.indexOf("Safari") > -1;
export const IsCamino = navigator.userAgent.indexOf("Camino") > -1;
export const IsOpera = IsChrome && navigator.userAgent.toLowerCase().indexOf("op") > -1 ? false : navigator.userAgent.toLowerCase().indexOf("op") > -1;

export const IsMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
export const IsIOS = (/iPad|iPhone|iPod/i.test(navigator.userAgent));
export const IdAndroid = (/Android/i.test(navigator.userAgent));

export const OpenMetamaskInstallation = () => {
  if (IsFirefox)
    OpenInNewTab('https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/');
  else if (IsOpera)
    OpenInNewTab('https://addons.opera.com/en/extensions/details/metamask/');
  else
    OpenInNewTab('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn');
};

export const OpenToshiInstallation = () => {
  if (IsIOS)
    OpenInNewTab('https://itunes.apple.com/us/app/toshi-ethereum/id1278383455?ls=1&mt=8');
  else
    OpenInNewTab('https://play.google.com/store/apps/details?id=org.toshi');
};

export const OpenCipherInstallation = () => {
  if (IsIOS)
    OpenInNewTab('https://itunes.apple.com/app/cipher-browser-for-ethereum/id1294572970?ls=1&mt=8');
  else
    OpenInNewTab('https://play.google.com/store/apps/details?id=com.cipherbrowser.cipher');
};

export const OpenInNewTab = (url) => {
  let win = window.open(url, '_blank');
  if (win) {
    //Browser has allowed it to be opened
    win.focus();
  } else {
    //Browser has blocked it
    alert('Please allow popups for this website');
  }
};


/**
 * Format
 */

export const VerifyEmail = (email) => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * General Utils
 */
export const Capitalize = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const CopyToClipboard = (str) => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

export const rangeRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};