// constant
var OCEAN_HIGH = 20; // fixed, can not change
var OCEAN_WIDTH = 50;
var OCEAN_BASE_POS = 510;
var ADD_FISH_FEE = 0.01; // ether
var DEFAULT_FISH_WEIGHT = 5;
var FISH_MOVE_CHARGE = 5; // percentage
var CASH_OUT_RATE = 100; // percentage
var MAX_POS = OCEAN_WIDTH * OCEAN_HIGH;
var MIN_WEIGHT_CASH_OUT = 25; // EMONT
var MIN_EATABLE = 1; // EMONT

var MIN_WEIGHT_DEDUCT = 20; // EMONT
var BASE_PUNISH = 0.0004; // per block
var OCEAN_BONUS = 0.00125; // per block
var MIN_WEIGHT_PUNISH = 1; // EMONT, no more push after this weight
var MAX_WEIGHT_BONUS = 25; // EMONT

var BLOCK_LOG_PERIOD = parseInt(24 * 60 * 60 / 15);

/*
Move:
    {
        "player": xxx, 
        "fish_id": xxx, 
        "from_pos": xxx, 
        "to_pos": xxx, 
        "weight"" xxx
    }
Eat: 
    {
        "player": xxx, 
        "defender": xxx, 
        "player_fish_id": xxx, 
        "defender_fish_id": xxx,
        "from_pos": xxx, 
        "to_pos": xxx, 
        "player_fish_weight": xxx
    }
SUICIDE:
    {
        "player": xxx, 
        "defender": xxx, 
        "player_fish_id": xxx,
        "defender_fish_id": xxx,
        "from_pos": xxx, 
        "to_pos": xxx, 
        "defender_fish_weight": xxx
    }
CASH_OUT:
    {
        "player": xxx,
        "fish_id": xxx
    }
ADD_BONUS:
    {
        "pos": xxx,
        "value": xx
    }
ADD_FISH
    {
        "player": xxx,
        "fish_id": xxx
    }
*/
var EVENT_TYPE = {
    MOVE: 1,
    EAT: 2,
    SUICIDE: 3,
    CASH_OUT: 4,
    ADD_BONUS: 5,
    ADD_FISH: 6,
    FIGHT: 7
}

var MAX_SQUARE_JUMP = {
    0: 50 * 50,
    1: 30 * 30,
    2: 20 * 20,
    3: 15 * 15,
    4: 12 * 12,
    5: 9 * 9,
    6: 7 * 7,
    7: 7 * 7,
    8: 6 * 6,
    9: 6 * 6,
    10: 6 * 6,
    11: 5 * 5,
    12: 5 * 5,
    13: 5 * 5,
    14: 5 * 5,
    15: 4 * 4 ,
    16: 4 * 4,
    17: 4 * 4,
    18: 4 * 4,
    19: 4 * 4,
    20: 3 * 3,
    21: 3 * 3,
    22: 3 * 3,
    23: 3 * 3,
    24: 3 * 3,
    25: 3 * 3
};

var MIN_SQUARE_JUMP = 2 * 2;

/*
position is marked top -> bottom, left -> right
(example of high = 5, width = 4)
0 5 10 15
1 6 11 16
2 7 12 17
3 8 13 18
4 9 14 19
*/

var ocean = {}; // pos => fish info
var fishpool = {}; // fish id => fish info
var currentBlockNumber = null;

var _transferEvent = null;
var _cashOutEvent = null;
var _bonusEvent = null;
var _moveEvent = null;
var _eatEvent = null;
var _suicideEvent = null;
var _fightEvent = null;
var _loadingOcean = false;


function _isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function _deductABS(a, b) {
	if (a > b) return (a - b);
	return (b - a);
}

function _updateOcean(fromX, toY, callbackFun) {
    if (rpcConnected) {
        var requestCount = 0;
        var responseCount = 0;
        var resultCode = RESULT_CODE.SUCCESS;
        function collectResponse(result, data) {
            responseCount += 1;
            if (resultCode == RESULT_CODE.SUCCESS) {
                if (result != RESULT_CODE.SUCCESS) {
                    resultCode = result;
                    callbackFun(result, data);
                } else {
                    if (responseCount == requestCount) {
                        // all data are collected
                        callbackFun(result, {});
                    }
                }
            }
        }

        var _queryActiveFishRange = function(fromPos, toPos) {
            requestCount += 1;
            emontFrenzyInstance.getActiveFish(fromPos, toPos, function(err, result) {
                if (err) {
                    collectResponse(RESULT_CODE.ERROR_SERVER, {
                        "error": "blockchain call failed, error=" + err
                    });
                } else {
                    var fishPos = result[0].toNumber();
                    var fishId = result[1].toNumber();
                    var player = result[2];
                    var weight = result[3].toNumber() / Math.pow(10, 8);
                    var fishBlockNumber = result[4].toNumber();
                    var weightBonus = 0;
                    if (weight < MAX_WEIGHT_BONUS) {
                        var blockGap = currentBlockNumber - fishBlockNumber;
                        if (blockGap < 0) blockGap = 0;
                        weightBonus = blockGap * OCEAN_BONUS;
                        if (weight + weightBonus > MAX_WEIGHT_BONUS)
                            weightBonus = MAX_WEIGHT_BONUS - weight;
                    }

                    if (weight == 0) {
                        collectResponse(RESULT_CODE.SUCCESS, {});
                    } else {
                        fishpool[fishId] = {
                            "fish_pos": fishPos,
                            "fish_id": fishId,
                            "player": player.toLowerCase(),
                            "weight": weight,
                            "weight_bonus": weightBonus,
                            "fish_block": fishBlockNumber
                        };
                        ocean[fishPos] = fishpool[fishId];
                        
                        if (fishPos < toPos) {
                            _queryActiveFishRange(fishPos+1, toPos);
                        }
                        collectResponse(RESULT_CODE.SUCCESS, {});
                    }
                }
            });
        }

        var _queryBonusRange = function(fromPos, toPos) {
            requestCount += 1;
            emontFrenzyInstance.getAllBonus(fromPos, toPos, function(err, result) {
                if (err) {
                    collectResponse(RESULT_CODE.ERROR_SERVER, {
                        "error": "blockchain call failed, error=" + err
                    });
                } else {
                    var pos = result[0].toNumber();
                    var amount = result[1].toNumber() / Math.pow(10, 8);

                    if (amount == 0) {
                        collectResponse(RESULT_CODE.SUCCESS, {});
                    } else {
                        ocean[pos] = amount;
                        if (pos < toPos) {
                            _queryBonusRange(pos+1, toPos);
                        }
                        collectResponse(RESULT_CODE.SUCCESS, {});
                    }
                }
            });
        }

        _queryActiveFishRange(fromX, toY);
        _queryBonusRange(fromX, toY);
    } 

}

function _sampleCallbackFun(result, data, event) {
    console.log("sample_callback|result=" + result);
    // result == RESULT_CODE
    if (result != RESULT_CODE.SUCCESS) {
        // data is {"error": xxx}
        console.log("error: " + data["error"]);
        return
    }

    // print ocean data
    for (var index in data) {
        if (typeof(data[index]) == "object") {
            var fishInfo = data[index];
            // fish info {"fish_id": xx, "player": xxx, "weight": xxx}
            console.log("pos=" + index + ",fish_id=" + fishInfo["fish_id"] + ",player=" + fishInfo["player"] + ",weight=" + fishInfo["weight"]);
        } else {
            // a number for emont bonus
            console.log("pos=" + index + ",bonus=" + data[index]);
        }
    }

    // print event
    // {"event_type": xx, "data"}
    if (event) {
        console.log("event_type=" + event["event_type"]);
        console.log(event["data"]);
    }
}

function _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// PUBLIC FUNCTION


function checkValidMove(weight, fromPos, toPos) {
	if (fromPos == toPos) return false;
	if (toPos >= OCEAN_WIDTH * OCEAN_HIGH) return false;

	var roundWeight = parseInt(weight);
    var squareLength = MAX_SQUARE_JUMP[roundWeight];
    if (squareLength == undefined) squareLength = MIN_SQUARE_JUMP;

	var tempX = _deductABS(parseInt(fromPos / OCEAN_HIGH), parseInt(toPos / OCEAN_HIGH));
	var tempY = _deductABS(parseInt(fromPos % OCEAN_HIGH), parseInt(toPos % OCEAN_HIGH));
	if (tempX * tempX + tempY * tempY > squareLength)
		return false;
	return true;
}

function addFish(callbackFun) {
	console.log("DEBUG_LOG|add_fish");
	if (isEtherAccountActive()) {
        emontFrenzyInstance.AddFish({value: web3.toWei(ADD_FISH_FEE, 'ether'), gas: 161000}, function(err, txhash) {
            if (err) {
                console.log("ERROR_LOG|add_fish_fail|error=" + err);
                callbackFun(RESULT_CODE.ERROR_SERVER, {
                    "error": "blockchain transaction fail!!"
                });
            } else {
                callbackFun(RESULT_CODE.SUCCESS, {"txn_hash": txhash})
            }
        });
    } else {
        var transData = emontFrenzyInstance.AddFish.getData();
        callbackFun(RESULT_CODE.NO_ACCOUNT_DETECTED, {"txn_data": transData, "address": EMONT_FRENZY_ADDRESS, "amount": ADD_FISH_FEE, "gas": 161000});
    }
}


function cashOut(callbackFun) {
    console.log("DEBUG_LOG|cash_out");
    if (isEtherAccountActive()) {
        emontFrenzyInstance.CashOut({gas: 119000}, function(err, txhash) {
            if (err) {
                console.log("ERROR_LOG|add_fish_fail|error=" + err);
                callbackFun(RESULT_CODE.ERROR_SERVER, {
                    "error": "blockchain transaction fail!!"
                });
            } else {
                callbackFun(RESULT_CODE.SUCCESS, {"txn_hash": txhash})
            }
        });
    } else {
        var transData = emontFrenzyInstance.CashOut.getData();
        callbackFun(RESULT_CODE.NO_ACCOUNT_DETECTED, {"txn_data": transData, "address": EMONT_FRENZY_ADDRESS, "amount": 0, "gas": 119000});
    }
}

// need to call checkValidMove before hand
function moveFish(fromPos, toPos, callbackFun) {
	console.log("DEBUG_LOG|move_fish");

	if (isEtherAccountActive()) {
        if (fromPos == OCEAN_BASE_POS) {
            // from base
            emontFrenzyInstance.MoveFromBase(toPos, {gas: 119000}, function(err, txhash) {
                if (err) {
                    console.log("ERROR_LOG|move_from_base_fail|error=" + err);
                    callbackFun(RESULT_CODE.ERROR_SERVER, {
                        "error": "blockchain transaction fail!!"
                    });
                } else {
                    callbackFun(RESULT_CODE.SUCCESS, {"txn_hash": txhash})
                }
            });
        } else if (toPos == OCEAN_BASE_POS) {

             emontFrenzyInstance.MoveToBase(fromPos, {gas: 119000}, function(err, txhash) {
                if (err) {
                    console.log("ERROR_LOG|move_to_base_fail|error=" + err);
                    callbackFun(RESULT_CODE.ERROR_SERVER, {
                        "error": "blockchain transaction fail!!"
                    });
                } else {
                    callbackFun(RESULT_CODE.SUCCESS, {"txn_hash": txhash})
                }
            });

        } else {

             emontFrenzyInstance.MoveFish(fromPos, toPos, {gas: 119000}, function(err, txhash) {
                if (err) {
                    console.log("ERROR_LOG|move_fish_fail|error=" + err);
                    callbackFun(RESULT_CODE.ERROR_SERVER, {
                        "error": "blockchain transaction fail!!"
                    });
                } else {
                    callbackFun(RESULT_CODE.SUCCESS, {"txn_hash": txhash})
                }
            });

        }

    } else {
        if (fromPos == 0) {
            var transData = emontFrenzyInstance.MoveFromBase.getData(toPos);
            callbackFun(RESULT_CODE.NO_ACCOUNT_DETECTED, {"txn_data": transData, "address": EMONT_FRENZY_ADDRESS, "amount": 0, "gas": 119000});
        } else if (toPos == 0) {
            var transData = emontFrenzyInstance.MoveToBase.getData(fromPos);
            callbackFun(RESULT_CODE.NO_ACCOUNT_DETECTED, {"txn_data": transData, "address": EMONT_FRENZY_ADDRESS, "amount": 0, "gas": 119000});
        } else {
            var transData = emontFrenzyInstance.MoveFish.getData(fromPos, toPos);
            callbackFun(RESULT_CODE.NO_ACCOUNT_DETECTED, {"txn_data": transData, "address": EMONT_FRENZY_ADDRESS, "amount": 0, "gas": 119000});           
        }
    }
}

function getPlayerFish(playerAddress, callbackFun) {
	console.log("DEBUG_LOG|get_player_fish");
	if (rpcConnected) {
        web3.eth.getBlockNumber(function(err, result){
            currentBlockNumber = result; 

            emontFrenzyInstance.getFishByAddress(playerAddress, function(err, result) {
                if (err) {
                    callbackFun(RESULT_CODE.ERROR_SERVER, {
                        "error": "blockchain transaction fail!!"
                    });
                } else {
                	var fishId = result[0].toNumber();
    	            var weight = parseFloat(result[2].toNumber() / Math.pow(10, 8));
    	            var active = result[3];
                    // if (!active) {
                    //     var fishBlockNumber = result[4].toNumber();
                    //     var blockGap = currentBlockNumber - fishBlockNumber;
                    //     var weightLoss = 0;
                    //     if (blockGap < 0) blockGap = 0;
                    //     if (weight > MIN_WEIGHT_PUNISH) {
                    //         weightLoss = blockGap * BASE_PUNISH;
                    //         if (weight - weightLoss < MIN_WEIGHT_PUNISH)
                    //             weightLoss = weight - MIN_WEIGHT_PUNISH;
                    //         weight = weight - weightLoss;
                    //     }
                    // }

                    var fishBlockNumber = result[4].toNumber();
                    callbackFun(RESULT_CODE.SUCCESS, {
                    	"fish_id": fishId,
                    	"weight": weight,
                    	"active": active,
                      "fish_block": fishBlockNumber,
                    })
                }
            });
        });
    }
}


// see _sampleCallbackFun (result, data, event) for more information
function loadOcean(callbackFun) {
    if (_loadingOcean == true) return;

	if (rpcConnected) {
        _loadingOcean = true;

        web3.eth.getBlockNumber(function(err, result){
            currentBlockNumber = result; 

            ocean = {};

            var requestCount = 0;
            var responseCount = 0;
            var resultCode = RESULT_CODE.SUCCESS;
            function collectResponse(result, data) {
                responseCount += 1;
                if (resultCode == RESULT_CODE.SUCCESS) {
                    if (result != RESULT_CODE.SUCCESS) {
                        resultCode = result;
                        callbackFun(result, data);
                    } else {
                        if (responseCount == requestCount) {
                            // all data are collected

                            // double check number of fish
                            emontFrenzyInstance.getStats(function(statsErr, statsData) {
                                if (statsErr) {
                                    callbackFun(RESULT_CODE.ERROR_SERVER, {
                                        "error": "blockchain transaction fail!!"
                                    });
                                } else {
                                    var totalFish = statsData[0].toNumber();

                                    console.log(totalFish);
                                    _loadingOcean = false;
                                    watchOcean(callbackFun);

                                    // count ocean
                                    var currentCount = 0;
                                    for (var index in ocean) {
                                        if (typeof(ocean[index]) == "object") {
                                            currentCount += 1;
                                        }
                                    }

                                    if (currentCount < totalFish || (totalFish == 0 && currentCount != 0)) {
                                        console.log("WARNING|fish_count_not_match|total=%s,count=%s", totalFish, currentCount);
                                        sleep(2000).then(() => {
                                            loadOcean(callbackFun);
                                        });
                                        
                                    } else {
                                        console.log("total_fish=%s", totalFish);
                                        callbackFun(result, ocean, null);
                                    }
                                }
                            });
                        }
                    }
                }
            }        

            for (var w = 0; w < OCEAN_WIDTH; w++) {
            	var fromPos = w * OCEAN_HIGH;
                requestCount ++;
                _updateOcean(fromPos, fromPos + OCEAN_HIGH - 1, collectResponse);
            }
        });
    } 
}

// callback(result, data, event)
function watchOcean(callbackFun) {
    var _handleGeneralMove = function(fromPos, toPos, eventData) {
        // load position from pos, to pos
        var requestCount = 0;
        var responseCount = 0;
        var resultCode = RESULT_CODE.SUCCESS;
        function collectResponse(result, data) {
            responseCount += 1;
            if (resultCode == RESULT_CODE.SUCCESS) {
                if (result != RESULT_CODE.SUCCESS) {
                    resultCode = result;
                    callbackFun(result, data);
                } else {
                    if (responseCount == requestCount) {
                        // all data are collected
                        //callbackFun(result, ocean, eventData);

                        // double check fish
                        // double check number of fish
                        emontFrenzyInstance.getStats(function(statsErr, statsData) {
                            if (statsErr) {
                                callbackFun(RESULT_CODE.ERROR_SERVER, {
                                    "error": "blockchain transaction fail!!"
                                });
                            } else {
                                var totalFish = statsData[0].toNumber();

                                // count ocean
                                var currentCount = 0;
                                for (var index in ocean) {
                                    if (typeof(ocean[index]) == "object") {
                                        currentCount += 1;
                                    }
                                }

                                if (currentCount < totalFish || (totalFish == 0 && currentCount != 0)) {
                                    console.log("WARNING|fish_count_not_match|total=%s,count=%s", currentCount, totalFish);
                                    var callbackEvent = function(loResult, loOcean, loEvent) {
                                        callbackFun(loResult, loOcean, eventData);
                                    }
                                    loadOcean(callbackEvent);
                                } else {
                                    console.log("total_fish=%s", totalFish);
                                    callbackFun(result, ocean, eventData);
                                }
                            }
                        });

                    }
                }
            }
        }

        if (fromPos > 0) {
            requestCount += 1;
            _updateOcean(fromPos, fromPos, collectResponse);
        }
        if (toPos > 0) {
            requestCount += 1;
            _updateOcean(toPos, toPos, collectResponse);
        } 
    }

    if (_moveEvent == null) {
        _moveEvent = emontFrenzyInstance.EventMove();
        _moveEvent.watch(function(error, result) {
            if (!result) return;
            let params = result.args;

            var fishId = params.fishId.toNumber();
            var weight = params.weight.toNumber() / Math.pow(10, 8);
            var toPos = params.toPos.toNumber();
            var fromPos = params.fromPos.toNumber();

            // update fish
            var fishInfo = fishpool[fishId];
            if (fishInfo) {
                fishInfo["fish_pos"] = toPos;
                fishInfo["weight"] = weight;
            }

            _handleGeneralMove(fromPos, toPos, {
                "event_type": EVENT_TYPE.MOVE,
                "data": {
                    "player": params.player,
                    "fish_id": fishId,
                    "from_pos": fromPos,
                    "to_pos": toPos,
                    "weight": weight
                }
            });
        });
    }

    if (_eatEvent == null) {
        _eatEvent = emontFrenzyInstance.EventEat();
        _eatEvent.watch(function(error, result) {
            if (!result) return;
            let params = result.args;
            // update fish
            var playerFishInfo = fishpool[params.playerFishId.toNumber()];
            if (playerFishInfo) {
                playerFishInfo["fish_pos"] = params.toPos.toNumber();
                playerFishInfo["weight"] = params.playerWeight.toNumber() / Math.pow(10, 8);
            }
            var defenderFishInfo = fishpool[params.defenderFishId.toNumber()];
            if (defenderFishInfo) {
                defenderFishInfo["fish_pos"] = 0;
                defenderFishInfo["weight"] = 0;
            }

            _handleGeneralMove(params.fromPos.toNumber(), params.toPos.toNumber(), {
                "event_type": EVENT_TYPE.EAT,
                "data": {
                    "player": params.player, 
                    "defender": params.defender, 
                    "player_fish_id": params.playerFishId.toNumber(), 
                    "defender_fish_id": params.defenderFishId.toNumber(),
                    "from_pos": params.fromPos.toNumber(), 
                    "to_pos": params.toPos.toNumber(), 
                    "player_fish_weight": params.playerWeight.toNumber() / Math.pow(10, 8)
                }
            });
        });
    }


    if (_suicideEvent == null) {
        _suicideEvent = emontFrenzyInstance.EventSuicide();
        _suicideEvent.watch(function(error, result) {
            if (!result) return;
            let params = result.args;
            // update fish
            var playerFishInfo = fishpool[params.playerFishId.toNumber()];
            if (playerFishInfo) {
                playerFishInfo["fish_pos"] = 0;
                playerFishInfo["weight"] = 0;
            }
            var defenderFishInfo = fishpool[params.defenderFishId.toNumber()];
            if (defenderFishInfo) {
                defenderFishInfo["fish_pos"] = params.toPos.toNumber();
                defenderFishInfo["weight"] = params.defenderWeight.toNumber() / Math.pow(10, 8);
            }

            _handleGeneralMove(params.fromPos.toNumber(), params.toPos.toNumber(), {
                "event_type": EVENT_TYPE.SUICIDE,
                "data": {
                    "player": params.player, 
                    "defender": params.defender, 
                    "player_fish_id": params.playerFishId.toNumber(), 
                    "defender_fish_id": params.defenderFishId.toNumber(),
                    "from_pos": params.fromPos.toNumber(), 
                    "to_pos": params.toPos.toNumber(), 
                    "defender_fish_weight": params.defenderWeight.toNumber() / Math.pow(10, 8)
                }
            });
        });
    }

    if (_fightEvent == null) {
        _fightEvent = emontFrenzyInstance.EventFight();
        _fightEvent.watch(function(error, result) {
            if (!result) return;
            let params = result.args;
            // update fish
            var playerFishInfo = fishpool[params.playerFishId.toNumber()];
            if (playerFishInfo) {
                playerFishInfo["weight"] = params.playerWeight.toNumber() / Math.pow(10, 8);
                if (playerFishInfo["weight"] > 0) {
                    playerFishInfo["fish_pos"] = params.toPos.toNumber();
                } else {
                    playerFishInfo["fish_pos"] = 0;
                    ocean[params.toPos.toNumber()] = 0;
                }
            }
            var defenderFishInfo = fishpool[params.defenderFishId.toNumber()];
            if (defenderFishInfo) {
                defenderFishInfo["fish_pos"] = 0
                defenderFishInfo["weight"] = 0;
            }

            _handleGeneralMove(params.fromPos.toNumber(), params.toPos.toNumber(), {
                "event_type": EVENT_TYPE.FIGHT,
                "data": {
                    "player": params.player, 
                    "defender": params.defender, 
                    "player_fish_id": params.playerFishId.toNumber(), 
                    "defender_fish_id": params.defenderFishId.toNumber(),
                    "from_pos": params.fromPos.toNumber(), 
                    "to_pos": params.toPos.toNumber(), 
                    "player_fish_weight": params.playerWeight.toNumber() / Math.pow(10, 8)
                }
            });
        });
    }

    if (_cashOutEvent == null) {
        _cashOutEvent = emontFrenzyInstance.EventCashout();
        _cashOutEvent.watch(function(error, result) {
            if (!result) return;

            let params = result.args;
            var fishInfo = fishpool[params.fishId.toNumber()];
            if (fishInfo) {
                fishInfo["weight"] = params.weight.toNumber() / Math.pow(10, 8);
            }

            callbackFun(RESULT_CODE.SUCCESS, ocean, {
                "event_type": EVENT_TYPE.CASH_OUT,
                "data": {
                    "player": params.player,
                    "fish_id": params.fishId.toNumber(),
                    "weight": params.weight.toNumber() / Math.pow(10, 8)
                }
            })
        });
    }
    if (_bonusEvent == null) {
        _bonusEvent = emontFrenzyInstance.EventBonus();
        _bonusEvent.watch(function(error, result) {
            if (!result) return;

            let params = result.args;
            _handleGeneralMove(params.pos.toNumber(), params.pos.toNumber(), {
                "event_type": EVENT_TYPE.ADD_BONUS,
                "data": {
                    "pos": params.pos.toNumber(),
                    "value": params.value.toNumber() / Math.pow(10, 8)
                }
            });
        });       
    }

    if (_transferEvent == null) {
        _transferEvent = emontFrenzyInstance.Transfer();
        _transferEvent.watch(function(error, result) {
            if (!result) return;
            let params = result.args;

            if (params._from != "0x0000000000000000000000000000000000000000")
                return;

            callbackFun(RESULT_CODE.SUCCESS, ocean, {
                "event_type": EVENT_TYPE.ADD_FISH,
                "data": {
                    "player": params._to,
                    "fish_id": params._tokenId.toNumber(),
                }
            })
        }); 
    }
}


function getLatestLog(playerAddress, callbackFun) {
    // load position from pos, to pos
    var resultList = [];
    var requestCount = 0;
    var responseCount = 0;
    var resultCode = RESULT_CODE.SUCCESS;
    function collectResponse(result, data) {
        responseCount += 1;
        if (resultCode == RESULT_CODE.SUCCESS) {
            if (result != RESULT_CODE.SUCCESS) {
                resultCode = result;
                callbackFun(result, data);
            } else {
                if (responseCount == requestCount) {
                    // all data are collected

                    function compare(a,b) {
                        if (a["block_number"] !== b["block_number"])
                            return a["block_number"] - b["block_number"];
                        else
                            return a["txn_index"] - b["txn_index"];
                    }

                    resultList.sort(compare);

                    callbackFun(result, resultList);
                }
            }
        }
    }

    requestCount += 1;
    web3.eth.getBlockNumber(function(err, result){
        var startBlock = result - BLOCK_LOG_PERIOD;

        requestCount += 1;

        var condition = {};
        if (playerAddress) {
            condition = {"_to": playerAddress}
        }
        emontFrenzyInstance.Transfer(condition, {fromBlock: startBlock, toBlock: 'latest'}).get((error, eventResult) => {
            if (error) {
                collectResponse(RESULT_CODE.ERROR_SERVER, {
                    "error": "blockchain call failed, error=" + err
                });
            } else {

                for (var i = 0; i < eventResult.length; i++) {
                    var result = eventResult[i];
                    var params = result.args;

                    if (params._from != "0x0000000000000000000000000000000000000000")
                        continue;

                    resultList.push({
                        "event_type": EVENT_TYPE.ADD_FISH,
                        "block_number": result.blockNumber,
                        "txn_index": result.transactionIndex,
                         "data": {
                            "player": params._to,
                            "fish_id": params._tokenId.toNumber(),
                        }
                    })
                }
                collectResponse(RESULT_CODE.SUCCESS, {});
            }
        });

        requestCount += 1;
        if (playerAddress) {
            condition = {"player": playerAddress}
        }
        emontFrenzyInstance.EventCashout(condition, {fromBlock: startBlock, toBlock: 'latest'}).get((error, eventResult) => {
            if (error) {
                collectResponse(RESULT_CODE.ERROR_SERVER, {
                    "error": "blockchain call failed, error=" + err
                });
            } else {

                for (var i = 0; i < eventResult.length; i++) {
                    var result = eventResult[i];
                    var params = result.args;
                    resultList.push({
                        "event_type": EVENT_TYPE.CASH_OUT,
                        "block_number": result.blockNumber,
                        "txn_index": result.transactionIndex,
                        "data": {
                            "player": params.player,
                            "fish_id": params.fishId.toNumber(),
                            "weight": params.weight.toNumber() / Math.pow(10, 8)
                        }
                    })
                }
                collectResponse(RESULT_CODE.SUCCESS, {});
            }
        });

        requestCount += 1;
        emontFrenzyInstance.EventMove(condition, {fromBlock: startBlock, toBlock: 'latest'}).get((error, eventResult) => {
            if (error) {
                collectResponse(RESULT_CODE.ERROR_SERVER, {
                    "error": "blockchain call failed, error=" + err
                });
            } else {
                for (var i = 0; i < eventResult.length; i++) {
                    var result = eventResult[i];
                    var params = result.args;
                    resultList.push({
                        "event_type": EVENT_TYPE.MOVE,
                        "block_number": result.blockNumber,
                        "txn_index": result.transactionIndex,
                        "data": {
                            "player": params.player,
                            "fish_id": params.fishId.toNumber(),
                            "from_pos": params.fromPos.toNumber(),
                            "to_pos": params.toPos.toNumber(),
                            "weight": params.weight.toNumber() / Math.pow(10, 8)
                        }
                    });
                }
                
                collectResponse(RESULT_CODE.SUCCESS, {});
            }
        });

        requestCount += 1;
        emontFrenzyInstance.EventEat(condition, {fromBlock: startBlock, toBlock: 'latest'}).get((error, eventResult) => {
            if (error) {
                collectResponse(RESULT_CODE.ERROR_SERVER, {
                    "error": "blockchain call failed, error=" + err
                });
            } else {

                for (var i = 0; i < eventResult.length; i++) {
                    var result = eventResult[i];
                    var params = result.args;
                    resultList.push({
                        "event_type": EVENT_TYPE.EAT,
                        "block_number": result.blockNumber,
                        "txn_index": result.transactionIndex,
                        "data": {
                            "player": params.player, 
                            "defender": params.defender, 
                            "player_fish_id": params.playerFishId.toNumber(), 
                            "defender_fish_id": params.defenderFishId.toNumber(),
                            "from_pos": params.fromPos.toNumber(), 
                            "to_pos": params.toPos.toNumber(), 
                            "player_fish_weight": params.playerWeight.toNumber() / Math.pow(10, 8)
                        }
                    });
                }
                
                collectResponse(RESULT_CODE.SUCCESS, {});
            }
        });


        if (playerAddress) {
            requestCount += 1;
            emontFrenzyInstance.EventEat({"defender": playerAddress}, {fromBlock: startBlock, toBlock: 'latest'}).get((error, eventResult) => {
                if (error) {
                    collectResponse(RESULT_CODE.ERROR_SERVER, {
                        "error": "blockchain call failed, error=" + err
                    });
                } else {

                    for (var i = 0; i < eventResult.length; i++) {
                        var result = eventResult[i];
                        var params = result.args;
                        resultList.push({
                            "event_type": EVENT_TYPE.EAT,
                            "block_number": result.blockNumber,
                            "txn_index": result.transactionIndex,
                            "data": {
                                "player": params.player, 
                                "defender": params.defender, 
                                "player_fish_id": params.playerFishId.toNumber(), 
                                "defender_fish_id": params.defenderFishId.toNumber(),
                                "from_pos": params.fromPos.toNumber(), 
                                "to_pos": params.toPos.toNumber(), 
                                "player_fish_weight": params.playerWeight.toNumber() / Math.pow(10, 8)
                            }
                        });
                    }
                    
                    collectResponse(RESULT_CODE.SUCCESS, {});
                }
            });
        }

        requestCount += 1;
        emontFrenzyInstance.EventSuicide(condition, {fromBlock: startBlock, toBlock: 'latest'}).get((error, eventResult) => {
            if (error) {
                collectResponse(RESULT_CODE.ERROR_SERVER, {
                    "error": "blockchain call failed, error=" + err
                });
            } else {
                for (var i = 0; i < eventResult.length; i++) {
                    var result = eventResult[i];
                    var params = result.args;
                    resultList.push({
                        "event_type": EVENT_TYPE.SUICIDE,
                        "block_number": result.blockNumber,
                        "txn_index": result.transactionIndex,
                        "data": {
                            "player": params.player, 
                            "defender": params.defender, 
                            "player_fish_id": params.playerFishId.toNumber(), 
                            "defender_fish_id": params.defenderFishId.toNumber(),
                            "from_pos": params.fromPos.toNumber(), 
                            "to_pos": params.toPos.toNumber(), 
                            "defender_fish_weight": params.defenderWeight.toNumber() / Math.pow(10, 8)
                        }
                    });
                }
                collectResponse(RESULT_CODE.SUCCESS, {});
            }
        });

        if (playerAddress) {
            requestCount += 1;
            emontFrenzyInstance.EventSuicide({"defender": playerAddress}, {fromBlock: startBlock, toBlock: 'latest'}).get((error, eventResult) => {
                if (error) {
                    collectResponse(RESULT_CODE.ERROR_SERVER, {
                        "error": "blockchain call failed, error=" + err
                    });
                } else {
                    for (var i = 0; i < eventResult.length; i++) {
                        var result = eventResult[i];
                        var params = result.args;
                        resultList.push({
                            "event_type": EVENT_TYPE.SUICIDE,
                            "block_number": result.blockNumber,
                            "txn_index": result.transactionIndex,
                            "data": {
                                "player": params.player, 
                                "defender": params.defender, 
                                "player_fish_id": params.playerFishId.toNumber(), 
                                "defender_fish_id": params.defenderFishId.toNumber(),
                                "from_pos": params.fromPos.toNumber(), 
                                "to_pos": params.toPos.toNumber(), 
                                "defender_fish_weight": params.defenderWeight.toNumber() / Math.pow(10, 8)
                            }
                        });
                    }
                    collectResponse(RESULT_CODE.SUCCESS, {});
                }
            });
        }

        requestCount += 1;
        emontFrenzyInstance.EventFight(condition, {fromBlock: startBlock, toBlock: 'latest'}).get((error, eventResult) => {
            if (error) {
                collectResponse(RESULT_CODE.ERROR_SERVER, {
                    "error": "blockchain call failed, error=" + err
                });
            } else {

                for (var i = 0; i < eventResult.length; i++) {
                    var result = eventResult[i];
                    var params = result.args;
                    resultList.push({
                        "event_type": EVENT_TYPE.FIGHT,
                        "block_number": result.blockNumber,
                        "txn_index": result.transactionIndex,
                        "data": {
                            "player": params.player, 
                            "defender": params.defender, 
                            "player_fish_id": params.playerFishId.toNumber(), 
                            "defender_fish_id": params.defenderFishId.toNumber(),
                            "from_pos": params.fromPos.toNumber(), 
                            "to_pos": params.toPos.toNumber(), 
                            "player_fish_weight": params.playerWeight.toNumber() / Math.pow(10, 8)
                        }
                    });
                }
                collectResponse(RESULT_CODE.SUCCESS, {});
            }
        });

        if (playerAddress) {
            requestCount += 1;
            emontFrenzyInstance.EventFight({"defender": playerAddress}, {fromBlock: startBlock, toBlock: 'latest'}).get((error, eventResult) => {
                if (error) {
                    collectResponse(RESULT_CODE.ERROR_SERVER, {
                        "error": "blockchain call failed, error=" + err
                    });
                } else {

                    for (var i = 0; i < eventResult.length; i++) {
                        var result = eventResult[i];
                        var params = result.args;
                        resultList.push({
                            "event_type": EVENT_TYPE.FIGHT,
                            "block_number": result.blockNumber,
                            "txn_index": result.transactionIndex,
                            "data": {
                                "player": params.player, 
                                "defender": params.defender, 
                                "player_fish_id": params.playerFishId.toNumber(), 
                                "defender_fish_id": params.defenderFishId.toNumber(),
                                "from_pos": params.fromPos.toNumber(), 
                                "to_pos": params.toPos.toNumber(), 
                                "player_fish_weight": params.playerWeight.toNumber() / Math.pow(10, 8)
                            }
                        });
                    }
                    
                    collectResponse(RESULT_CODE.SUCCESS, {});
                }
            });
        }

        if (!playerAddress) {
            // get bonus event
            requestCount += 1;
            emontFrenzyInstance.EventBonus({}, {fromBlock: startBlock, toBlock: 'latest'}).get((error, eventResult) => {
                if (error) {
                    collectResponse(RESULT_CODE.ERROR_SERVER, {
                        "error": "blockchain call failed, error=" + err
                    });
                } else {
                    for (var i = 0; i < eventResult.length; i++) {
                        var result = eventResult[i];
                        var params = result.args;
                        resultList.push({
                            "event_type": EVENT_TYPE.ADD_BONUS,
                            "data": {
                                "pos": params.pos.toNumber(),
                                "value": params.value.toNumber() / Math.pow(10, 8)
                            }
                        });
                    }

                    collectResponse(RESULT_CODE.SUCCESS, {});
                }
            });
        }



        collectResponse(RESULT_CODE.SUCCESS, {});
    })
   
}

function getStats(callbackFun) {
    if (rpcConnected) {
        emontFrenzyInstance.getStats(function(err, result) {
            if (err) {
                callbackFun(RESULT_CODE.ERROR_SERVER, {
                    "error": "blockchain transaction fail!!"
                });
            } else {
                var totalFish = result[0].toNumber();
                var totalBonus = result[1].toNumber();

                callbackFun(RESULT_CODE.SUCCESS, {"total_fish": totalFish, "total_coin": totalBonus})
            }
        });
    }
} 

function getBaseFishes(callbackFun) {
    if (rpcConnected) {
        var resultList = [];

        web3.eth.getBlockNumber(function(err, result){
            currentBlockNumber = result; 

            var queryFunc = function(startFishId) {
                emontFrenzyInstance.getFishAtBase(startFishId, function(err, result) {
                    if (err) {
                        callbackFun(RESULT_CODE.ERROR_SERVER, {
                            "error": "blockchain transaction fail!!"
                        });
                    } else {
                        var fishId = result[0].toNumber();
                        var player = result[1];
                        var weight = result[2].toNumber() / Math.pow(10, 8);
                        var fishBlockNumber = result[3].toNumber();
                        var blockGap = currentBlockNumber - fishBlockNumber;
                        var weightLoss = 0;
                        if (blockGap < 0) blockGap = 0;
                        if (weight > MIN_WEIGHT_PUNISH) {
                            weightLoss = blockGap * BASE_PUNISH;
                            if (weight - weightLoss < MIN_WEIGHT_PUNISH)
                                weightLoss = weight - MIN_WEIGHT_PUNISH;
                            weight = weight - weightLoss;
                        }
                        

                        
                        if (fishId == 0) {
                            // double check fish
                            emontFrenzyInstance.countFishAtBase(function(statErr, statResult) {
                                if (statErr) {
                                    callbackFun(RESULT_CODE.ERROR_SERVER, {
                                        "error": "blockchain transaction fail!!"
                                    });
                                } else {
                                    var totalFish = statResult.toNumber();
                                    console.log("at_base|total_fish=" + totalFish);
                                    if (resultList.length < totalFish || (totalFish == 0 && resultList.length != 0)) {
                                        sleep(2000).then(() => {
                                            resultList = [];
                                            queryFunc(0);
                                        });
                                    } else {
                                        callbackFun(RESULT_CODE.SUCCESS, resultList);
                                    }
                                }
                            });                            
                        } else {
                            resultList.push({
                                "fish_id": fishId,
                                "player": player,
                                "weight": weight,
                                "weight_loss": weightLoss,
                                "fish_block": fishBlockNumber
                            });
                            queryFunc(fishId+1);
                        }
                    }
                });
            }

            queryFunc(0);
        });
    }     
}