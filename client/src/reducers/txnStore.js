import { Actions } from '../actions/index'


export const txnStore = (state = {currentTxn: null, txnLogs: []}, action) => {
  let newState;

  switch (action.type) {
    case Actions.txnAction.types.ADD_TXN:
      if (state.currentTxn && state.currentTxn.waiting && !state.currentTxn.done && !action.txn.forceUpdate) {
        return state;
      } else {
        newState = {currentTxn: {...action.txn, id: state.txnLogs.length+1}, txnLogs: [...state.txnLogs, action.txn]};
        return newState;
      }

    case Actions.txnAction.types.POP_TXN:
      newState = {...state, currentTxn: null};
      return newState;

    case Actions.txnAction.types.FINISH_TXN:
      if (state.currentTxn && state.currentTxn.waiting && !state.currentTxn.done) {
        newState = {...state, currentTxn: {...state.currentTxn, done: true}};
        return newState;
      } else {
        return state;
      }

    default:
      return state;
  }
};

export const getCurrentTxn = (state) => (state.currentTxn);
export const getTxnLogs = (state) => (state.txnLogs);