import cloneDeep from 'lodash/cloneDeep';


/**
 * Auth
 */
export const GetLoggedInUserId = (state) => (state.auth['userId']);

/**
 * Ocean
 */
export const GetFish = (state, userId) => (cloneDeep(state.ocean['fish'][userId]));

export const GetLog = (state, userId) => (cloneDeep(state.ocean['log'][userId]));

export const GetOcean = (state) => (cloneDeep(state.ocean['world']));

export const GetGameLog = (state) => (cloneDeep(state.ocean['gameLog']));

export const GetBaseFishes = (state) => (cloneDeep(state.ocean['baseFishes']));