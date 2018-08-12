import * as ActionTypes from '../actions/action_types';
import {all, call, fork, put, select, take} from "redux-saga/es/internal/io";
import takeLatest from "redux-saga/es/internal/sagaHelpers/takeLatest";
import * as selectors from "../reducers/selectors";
import {Actions} from "../actions";
import * as Api from "../services/api";


function* fetchUserLog({userId}) {
  yield put(Actions.ocean.fetchUserLog.request({userId}));
  const {response, error} = yield call(Api.getUserLog, userId);

  if (!error) {
    yield put(Actions.ocean.fetchUserLog.success({userId, response}));
  } else {
    yield put(Actions.ocean.fetchUserLog.fail({userId, error}));
  }
}

function* fetchUserFish({userId}) {
  yield put(Actions.ocean.fetchUserFish.request({userId}));
  const {response, error} = yield call(Api.getUserFish, userId);

  if (!error) {
    yield put(Actions.ocean.fetchUserFish.success({userId, response}));
  } else {
    yield put(Actions.ocean.fetchUserFish.fail({userId, error}));
  }
}

function* fetchGameLog() {
  yield put(Actions.ocean.fetchGameLog.request({}));
  const {response, error} = yield call(Api.getUserLog, null);

  if (!error) {
    yield put(Actions.ocean.fetchGameLog.success({response}));
  } else {
    yield put(Actions.ocean.fetchGameLog.fail({error}));
  }
}

function* fetchBaseFishes() {
  yield put(Actions.ocean.fetchBaseFish.request({}));
  const {response, error} = yield call(Api.getBaseFishes, null);

  if (!error) {
    yield put(Actions.ocean.fetchBaseFish.success({response}));
  } else {
    yield put(Actions.ocean.fetchBaseFish.fail({error}));
  }
}


export function* loadUserLog({forceUpdate}) {
  function* process() {
    let userId = yield select(selectors.GetLoggedInUserId);
    let userLog = yield select(selectors.GetLog, userId);

    if (userId && (!userLog || forceUpdate)) yield fetchUserLog({userId});
  }

  yield process();
  while (true) {
    const action = yield take([ActionTypes.LOGIN_SUCCESS, ActionTypes.LOAD_USER_FISH.STOP]);
    if (action.type === ActionTypes.LOAD_USER_FISH.STOP) break;
    if (action.type === ActionTypes.LOGIN_SUCCESS) yield process();
  }
}

export function* loadUserFish({forceUpdate}) {
  function* process() {
    let userId = yield select(selectors.GetLoggedInUserId);
    let userFish = yield select(selectors.GetFish, userId);
    if (userId && (!userFish || forceUpdate)) yield fetchUserFish({userId});
  }

  yield process();
  while (true) {
    const action = yield take([ActionTypes.LOGIN_SUCCESS, ActionTypes.LOAD_USER_FISH.STOP]);
    if (action.type === ActionTypes.LOAD_USER_FISH.STOP) break;
    if (action.type === ActionTypes.LOGIN_SUCCESS) yield process();
  }
}

export function* loadGameLog({forceUpdate}) {
  let currentLog = yield select(selectors.GetGameLog);
  if (!currentLog || forceUpdate)
    yield fetchGameLog();
}

export function* loadBaseFishes({forceUpdate}) {
  let baseFishes = yield select(selectors.GetBaseFishes);
  if (!baseFishes || forceUpdate)
    yield fetchBaseFishes();
}


function* watchLoadUserLog() {
  yield takeLatest(ActionTypes.LOAD_USER_LOG.START, loadUserLog);
}

function* watchLoadUserFish() {
  yield takeLatest(ActionTypes.LOAD_USER_FISH.START, loadUserFish);
}

function* watchLoadGameLog() {
  yield takeLatest(ActionTypes.LOAD_GAME_LOG, loadGameLog);
}

function* watchLoadBaseFishes() {
  yield takeLatest(ActionTypes.LOAD_BASE_FISHES, loadBaseFishes);
}


export function* watchAll() {
  yield all([
    fork(watchLoadUserLog),
    fork(watchLoadUserFish),
    fork(watchLoadGameLog),
    fork(watchLoadBaseFishes),
  ]);
}
