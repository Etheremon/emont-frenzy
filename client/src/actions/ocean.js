import {action} from "./action_utils";
import * as types from "./action_types";

export const loadOcean = () => action(types.LOAD_OCEAN, {});

export const fetchOcean = {
  request: () => action(types.FETCH_OCEAN.REQUESTED, {}),
  success: ({response}) => action(types.FETCH_OCEAN.SUCCESS, {response}),
  fail: ({error}) => action(types.FETCH_OCEAN.FAILED, {error}),
};

export const loadUserLog = {
  start: ({forceUpdate}) => action(types.LOAD_USER_LOG.START, {forceUpdate}),
  stop: () => action(types.LOAD_USER_LOG.STOP, {})
};

export const fetchUserLog = {
  request: ({userId}) => action(types.FETCH_USER_LOG.REQUESTED, {userId}),
  success: ({userId, response}) => action(types.FETCH_USER_LOG.SUCCESS, {userId, response}),
  fail: ({userId, error}) => action(types.FETCH_USER_LOG.FAILED, {userId, error}),
};

export const loadUserFish = {
  start: ({forceUpdate}) => action(types.LOAD_USER_FISH.START, {forceUpdate}),
  stop: () => action(types.LOAD_USER_FISH.STOP, {})
};

export const fetchUserFish = {
  request: ({userId}) => action(types.FETCH_USER_FISH.REQUESTED, {userId}),
  success: ({userId, response}) => action(types.FETCH_USER_FISH.SUCCESS, {userId, response}),
  fail: ({userId, error}) => action(types.FETCH_USER_FISH.FAILED, {userId, error}),
};

export const loadGameLog = ({forceUpdate}) => action(types.LOAD_GAME_LOG, {forceUpdate});

export const fetchGameLog = {
  request: ({}) => action(types.FETCH_GAME_LOG.REQUESTED, {}),
  success: ({response}) => action(types.FETCH_GAME_LOG.SUCCESS, {response}),
  fail: ({error}) => action(types.FETCH_GAME_LOG.FAILED, {error}),
};

export const loadBaseFish = ({forceUpdate}) => action(types.LOAD_BASE_FISHES, {forceUpdate});

export const fetchBaseFish = {
  request: ({}) => action(types.FETCH_BASE_FISHES.REQUESTED, {}),
  success: ({response}) => action(types.FETCH_BASE_FISHES.SUCCESS, {response}),
  fail: ({error}) => action(types.FETCH_BASE_FISHES.FAILED, {error}),
};