import {createRequestTypes, createFlowTypes} from './action_utils';


/**
 * AUTH related actions
 */
export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILED = 'LOGIN_FAILED';


/**
 * loader
 */
export const LOADING = createFlowTypes('LOADING');


/**
 *  OCEAN
 */
export const LOAD_OCEAN = 'LOAD_OCEAN';
export const FETCH_OCEAN = createRequestTypes('FETCH_OCEAN');

export const LOAD_USER_LOG = createFlowTypes('LOAD_USER_LOG');
export const FETCH_USER_LOG = createRequestTypes('FETCH_USER_LOG');

export const LOAD_USER_FISH = createFlowTypes('LOAD_USER_FISH');
export const FETCH_USER_FISH = createRequestTypes('FETCH_USER_FISH');

export const LOAD_GAME_LOG = 'LOAD_GAME_LOG';
export const FETCH_GAME_LOG = createRequestTypes('FETCH_GAME_LOG');

export const LOAD_BASE_FISHES = 'LOAD_BASE_FISHES';
export const FETCH_BASE_FISHES = createRequestTypes('FETCH_BASE_FISHES');