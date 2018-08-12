import { txnStore } from './txnStore'
import { auth } from './auth'
import { loading } from './loading'
import { ocean } from './ocean';


export const etheremonStoreReducers = {
  auth,

  txnStore,
  loading,

  ocean,
};

export const getTxnStore = (store) => (store['txnStore']);
