/*
 This file is part of kaya.
  Copyright (c) 2018 - present Zilliqa Research Pvt. Ltd.

  kaya is free software: you can redistribute it and/or modify it under the
  terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  kaya is distributed in the hope that it will be useful, but WITHOUT ANY
  WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
  A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along with
  kaya.  If not, see <http://www.gnu.org/licenses/>.
*/

require("isomorphic-fetch");
const { Zilliqa } = require("@zilliqa-js/zilliqa");
const CP = require ('@zilliqa-js/crypto');
const fs = require("fs");
const { argv } = require("yargs");
const { BN, Long, bytes, units } = require('@zilliqa-js/util');

const url = "http://localhost:4200";
const zilliqa = new Zilliqa(url);

const getNonceAsync = (addr) => {
  return new Promise((resolve, reject) => {
    zilliqa.blockchain.getBalance(addr).then((data) => {
      if (data.error) {
        reject(data.error);
      } else {
        resolve(data.result.nonce);
      }
    });
  });
};

let privateKey;
let nonceVal;
if (argv.test) {
  privateKey = "db11cfa086b92497c8ed5a4cc6edb3a5bfe3a640c43ffb9fc6aa0873c56f2ee3";
} else {
  // User supplies the private key through `--key`
  if (argv.key) {
    privateKey = argv.key;
    console.log(`Your Private Key: ${privateKey} \n`);
  } else {
    console.log("No private key given! Using default key.");
    // privateKey = zilliqa.util.generatePrivateKey();
    privateKey = "db11cfa086b92497c8ed5a4cc6edb3a5bfe3a640c43ffb9fc6aa0873c56f2ee3";
    console.info(`Your Private Key: ${privateKey.toString("hex")}`);
  }
}

console.log("Zilliqa Testing Script");
console.log(`Connected to ${url}`);
const address = CP.getAddressFromPrivateKey(privateKey);
zilliqa.wallet.addByPrivateKey(privateKey);

getNonceAsync(address)
  .then((currentNonce) => {
    nonceVal = currentNonce + 1;

    console.log(`Address: ${address} User's current nonce: ${currentNonce}`);
    console.log(`Deploying contract. Nonce of payload: ${nonceVal}`);

    /* Contract specific Parameters */

    const codeStr = fs.readFileSync("../contract/frenzy.scillia", "utf-8");
    // the immutable initialisation variables
    const initParams = [
      {
        vname: "_scilla_version",
        type: "Uint32",
        value: "0"
      },
      {
        vname: "owner",
        type: "ByStr20",
        value: `0x${address}`,
      },
      {
        vname: "_creation_block",
        type: "BNum",
        value: "100",
      },
    ];

    // Instance of class Contract
    const contract = zilliqa.contracts.new(codeStr, initParams);

    contract.deploy({
        version: 0,
        gasPrice: units.toQa('1000', units.Units.Li),
        gasLimit: Long.fromNumber(10000)
    }).then((data) => {
        if (data.error) {
            console.log("error", data.error);
        } else {
            const [deployTxn, contractInstance] = data;
            console.log(`Deployment Transaction ID: ${deployTxn.id}`);
            console.log(`Deployment Transaction Receipt:`, deployTxn.txParams.receipt);
            console.log(`The contract address is: ${contractInstance.address}`);
        }
   });

  })
  .catch(err => {
      console.log(err);
  });
