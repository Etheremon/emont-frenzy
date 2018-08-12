import * as ActionTypes from '../actions/action_types';
import {combineReducers} from "redux";


const world = (state = {world: undefined}, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_OCEAN.REQUESTED:
      return {...state, world: undefined};

    case ActionTypes.FETCH_OCEAN.SUCCESS:
      return {...state, world: action.response};

    default:
      return state;
  }
};

const fish = (state = {null: {fish_id: 0}}, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_USER_FISH.REQUESTED:
      return {...state, [action.userId]: undefined};

    case ActionTypes.FETCH_USER_FISH.SUCCESS:
      // console.log(action);
      return {...state, [action.userId]: action.response};

    default:
      return state;
  }
};

const log = (state = {null: []}, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_USER_LOG.REQUESTED:
      // console.log(action);
      return {...state, [action.userId]: undefined};

    case ActionTypes.FETCH_USER_LOG.SUCCESS:
      // console.log(action);
      return {...state, [action.userId]: action.response};

    default:
      return state;
  }
};

const gameLog = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_GAME_LOG.SUCCESS:
      // console.log(action);
      return [...action.response];

    default:
      return state;
  }
};

const baseFishes = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_BASE_FISHES.REQUESTED:
      return null;

    case ActionTypes.FETCH_BASE_FISHES.SUCCESS:
      // console.log(action);
      return [...action.response];

    default:
      return state;
  }
};

export const ocean = combineReducers({
  world: world,
  fish: fish,
  log: log,
  gameLog: gameLog,
  baseFishes: baseFishes,
});
