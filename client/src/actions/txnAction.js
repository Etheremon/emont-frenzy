export const types = {
  ADD_TXN: 'ADD_TXN',
  POP_TXN: 'POP_TXN',
  FINISH_TXN: 'FINISH_TXN',
};

export const addTxn = (txn) => ({
  type: types.ADD_TXN,
  txn,
});

export const popTxn = () => ({
  type: types.POP_TXN,
});

export const finishTxn = () => ({
  type: types.FINISH_TXN,
});