import * as ActionTypes from '../actions/action_types';


const defaultState = {};

export const loading = (state = defaultState, action) => {
  switch (action.type) {
    case ActionTypes.LOADING.START:
      return { ...state, [action.loadingType]: true };

    case ActionTypes.LOADING.STOP:
      return { ...state, [action.loadingType]: false};

    default:
      return state;
  }
};
