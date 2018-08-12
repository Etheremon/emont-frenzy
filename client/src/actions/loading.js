/**
 * Created by jarvis on 27/02/18.
 */
import * as types from './action_types';
import {action} from './action_utils';


export const load = {
  start: (loadingType) => action(types.LOADING.START, {loadingType}),
  stop: (loadingType) => action(types.LOADING.STOP, {loadingType}),
};
