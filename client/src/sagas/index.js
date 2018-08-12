import 'regenerator-runtime/runtime';
import {fork} from 'redux-saga/effects';

/**
 * action-related
 */
import {watchAll as AuthWatcher} from './auth';
import {watchAll as OceanWatcher} from './ocean';


export default function* rootSaga() {
  const watchers = [
    /** action-related watcher **/
    fork(AuthWatcher),
    fork(OceanWatcher),
  ];
  // if (__BROWSER__) {
  //   watchers.push(fork(trackingWatcher));
  // }
  yield* watchers;
}
