require("isomorphic-fetch");
const BN = require("bn.js");
const { Zilliqa } = require("zilliqa-js");
const { promisify } = require("util");
const url = "http://localhost:4200";
const { argv } = require("yargs");

const zilliqa = new Zilliqa({
  nodeUrl: url,
});

const makeTxnDetails = (nonceVal, msg, toAddr) => {
    txnDetails = {
        version: 0,
        nonce: nonceVal,
        to: toAddr,
        amount: new BN(0),
        gasPrice: 1,
        gasLimit: 50000,
        data: JSON.stringify(msg).replace(/\\"/g, '"'),
    };
    return txnDetails;
};

const getNonceAsync = addr => {
  return new Promise((resolve, reject) => {
    zilliqa.node.getBalance({ address: addr }, (err, data) => {
      if (err || data.error) {
        reject(err);
      } else {
        resolve(data.result.nonce);
      }
    });
  });
};


/*
*   Main Logic
*/

function sendZilliqaTransaction(senderAddr, msg, privateKey, toAddr) {

  console.log("to addr: ", toAddr);
// Get user's nonce and increment it by one before sending transaction
  getNonceAsync(senderAddr)
    .then(nonce => {
      console.log(`User's current nonce: ${nonce}`);
      const nonceVal = nonce + 1;
      console.log(`Payload's Nonce is ${nonceVal}`);
      const txnDetails = makeTxnDetails(nonceVal, msg, toAddr);
      const txn = zilliqa.util.createTransactionJson(privateKey, txnDetails);
      zilliqa.node.createTransaction(txn, (err, data) => {
          if (err || data.error) {
            console.log(err);
          } else {
            console.log(data);
          }
        });
    })
    .catch(err => console.log(err));
}

let privateKey;
let recipient;

if (argv.test) {
  // test mode uses keys from the account fixtures
  privateKey = "db11cfa086b92497c8ed5a4cc6edb3a5bfe3a640c43ffb9fc6aa0873c56f2ee3";
  recipient = "cef48d2ec4086bd5799b659261948daab02b760d";
} else {
  // User supplies the private key through `--key`
  if (argv.key) {
    privateKey = argv.key;
    console.log(`Your Private Key: ${privateKey} \n`);
  } else {
    console.log("No private key given! Using default key.".green);
    privateKey = "db11cfa086b92497c8ed5a4cc6edb3a5bfe3a640c43ffb9fc6aa0873c56f2ee3";
    // privateKey = zilliqa.util.generatePrivateKey();
    console.info(`Your Private Key: ${privateKey.toString("hex")}`);
  }

  if (!argv.to) {
    console.log("To address not give. Using default address.");
    recipient = "cef48d2ec4086bd5799b659261948daab02b760d";
    // process.exit(0);
  }
  else {
    recipient = argv.to;
  }
}

module.exports.setFishPrice = function setFishPrice(price, pk, to) {
  const senderAddr = zilliqa.util.getAddressFromPrivateKey(pk);
  const msg = {
    _tag: "setFishPrice",
    _amount: "0",
    _sender: `0x${senderAddr}`,
    params: [
      {
        vname: "new_fish_price",
        type: "Uint128",
        value: JSON.stringify(price),
      },
    ],
  };

  sendZilliqaTransaction(senderAddr, msg, pk, to);
}

module.exports.setOceanSize = function setOceanSize(oceanSize, pk, to) {
  const senderAddr = zilliqa.util.getAddressFromPrivateKey(pk);
  const msg = {
    _tag: "setOceanSize",
    _amount: "0",
    _sender: `0x${senderAddr}`,
    params: [
      {
        vname: "new_ocean_size",
        type: "Uint128",
        value: JSON.stringify(oceanSize),
      },
    ],
  };

  sendZilliqaTransaction(senderAddr, msg, pk, to);
}

let RANDOM_SEED = 1011;

module.exports.setBait = function setBait(random_seed, bait_size, pk, to) { // TODO: remove random_seed because BHash is unavailable
  const senderAddr = zilliqa.util.getAddressFromPrivateKey(pk);
  const msg = {
    _tag: "setBait",
    _amount: "0",
    _sender: `0x${senderAddr}`,
    params: [
      {
        vname: "seed",
        type: "Uint128",
        value: JSON.stringify(random_seed),
      },
      {
        vname: "bait_size",
        type: "Uint128",
        value: JSON.stringify(bait_size),
      },
    ],
  };

  sendZilliqaTransaction(senderAddr, msg, pk, to);
}

module.exports.buyFish = function buyFish(random_seed, fish_price, pk, to) { // TODO: remove random_seed because BHash is unavailable
  const senderAddr = zilliqa.util.getAddressFromPrivateKey(pk);
  const msg = {
    _tag: "setBait",
    _amount: JSON.stringify(fish_price),
    _sender: `0x${senderAddr}`,
    params: [
      {
        vname: "seed",
        type: "Uint128",
        value: JSON.stringify(random_seed),
      }
    ],
  };

  sendZilliqaTransaction(senderAddr, msg, pk, to);
}

module.exports.moveFish = function moveFish(new_fish_x, new_fish_y, random_seed, pk, to) { // TODO: remove random_seed because BHash is
  const senderAddr = zilliqa.util.getAddressFromPrivateKey(pk);unavailable
  const msg = {
    _tag: "setBait",
    _amount: JSON.stringify(fish_price),
    _sender: `0x${senderAddr}`,
    params: [
      {
        vname: "seed",
        type: "Uint128",
        value: JSON.stringify(random_seed),
      },
      {
        vname: "new_fish_x",
        type: "Uint128",
        value: JSON.stringify(new_fish_x),
      },
      {
        vname: "new_fish_y",
        type: "Uint128",
        value: JSON.stringify(new_fish_y),
      },
    ],
  };

  sendZilliqaTransaction(senderAddr, msg, pk, to);
}

function getRandom() {
  return Math.floor(Math.random() * 1000);
}

// Example call
// setFishPrice(25, privateKey, recipient);
// setBait(getRandom(), 10, privateKey, recipient);

