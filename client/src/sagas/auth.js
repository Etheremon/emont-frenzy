
import * as ActionTypes from '../actions/action_types';
import { Actions } from '../actions/index';
import {all, fork, put} from "redux-saga/es/internal/io";
import takeLatest from "redux-saga/es/internal/sagaHelpers/takeLatest";


export function* login({userId}) {
  if (window.isValidEtherAddress(userId) || userId === null) {
    yield put(Actions.auth.loginSuccess(userId));
  } else {
    yield put(Actions.auth.loginFailed(userId, 'err.invalid_ether_address'));
  }
}

function* watchLogin() {
  yield takeLatest(ActionTypes.LOGIN, login);
}

export function* watchAll() {
  yield all([
    fork(watchLogin),
  ]);
}
