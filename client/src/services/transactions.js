function defaultCallbackFunction(code, data) {
  switch (code) {
    case window.RESULT_CODE.SUCCESS:
      this.callback({'txn_hash': data['txn_hash']});
      break;
    case window.RESULT_CODE.NO_ACCOUNT_DETECTED:
      this.callback({'txn_data': data});
      break;
    default:
      this.callback({'err': data['error']});
  }
}


export const BuyFish = (dispatch, action, _t, {}, finishCallback) => {
  dispatch(action({
    waiting: true,
    title: _t('txt.confirm_to_buy_fish'),
    note: _t('txt.buy_fish_desc'),
    title_done: _t('txn.buying_fish'),
    fields_order: ['price', 'weight'],
    button: _t('txt.buy_now'),
    fields: {
      price: {
        text: _t('txt.price'),
        value: `${window.ADD_FISH_FEE} ETH`,
        readonly: true,
        type: 'text',
      },
      weight: {
        text: _t('txt.default_weight'),
        value: `${window.DEFAULT_FISH_WEIGHT} EMONT`,
        readonly: true,
        type: 'text',
      },
    },
    submitFunc: function(obj, callback) {
      // Validating Data
      // if (obj.current_energy.value < obj.energy_consume.value) {
      //   callback({'err': _t('err.not_enough_energy')});
      //   return;
      // }

      // Bind callback
      this.callback = callback;

      // Sending Txn
      window.addFish(defaultCallbackFunction.bind(this));
    },
    onFinishCallback: function(data) {
      finishCallback && finishCallback(data);
    },

  }));
};

export const MoveFish = (dispatch, action, _t, {fromPos, toPos, source, target}, finishCallback) => {
  let desc = '';
  let title  = '';
  let note = undefined;

  let newWeight = source.current.info.weight;
  let energy = 0;
  if (fromPos !== window.OCEAN_BASE_POS && source.current.info.weight > window.MIN_WEIGHT_DEDUCT) {
    energy = source.current.info.weight * window.FISH_MOVE_CHARGE / 100;
    newWeight = source.current.info.weight - energy;
  }

  let fieldsOrder = ['current', 'energy', 'new_weight', 'destination'];

  if (toPos === window.OCEAN_BASE_POS) {
    // Case back to base
    title = _t('txt.confirm_to', {action: _t('txt.action_hide')});
    note = _t('txt.action_hide_desc');
    fieldsOrder = ['current', 'energy', 'estimated_bonus', 'estimated_new_weight', 'destination']
    desc = _t('txt.destination_dot_desc', {column: target.column, row: target.row});
  } else {
    if (target.current.isDot) {
      if (fromPos === window.OCEAN_BASE_POS) {
        // Case move from base
        title = _t('txt.confirm_to', {action: _t('txt.action_move')});
        fieldsOrder = ['current', 'energy', 'estimated_loss', 'estimated_new_weight', 'destination']
      } else {
        title = _t('txt.confirm_to', {action: _t('txt.action_move')});
      }
      desc = _t('txt.destination_dot_desc', {column: target.column, row: target.row});
    } else if (target.current.isCoin) {
      if (fromPos === window.OCEAN_BASE_POS) {
        // Case move from base
        fieldsOrder = ['current', 'energy', 'estimated_loss', 'estimated_new_weight', 'destination']
      }

      title = _t('txt.confirm_to', {action: _t('txt.action_collect_emont')});
      note = _t('txt.action_collect_emont_desc', {amount: target.current.info})
      desc = _t('txt.destination_coin_desc', {column: target.column, row: target.row, amount: target.current.info});
    } else if (target.current.isFish) {
      desc = _t('txt.your_fish_desc', {
        column: target.column,
        row: target.row,
        fish_id: target.current.info.fish_id,
        weight: target.current.info.weight
      });

      if (newWeight >= target.current.info.weight + window.MIN_EATABLE) {
        title = _t('txt.confirm_to', {action: _t('txt.action_eat')});
        note = _t('txt.action_eat_desc', {amount: target.current.info.weight})
      } else if (target.current.info.weight < newWeight && newWeight < target.current.info.weight + window.MIN_EATABLE) {
        title = _t('txt.confirm_to', {action: _t('txt.action_fight')});
        note = _t('txt.action_fight_desc', {amount: target.current.info.weight});
      } else {
        title = _t('txt.confirm_to', {action: _t('txt.action_suicide_attack')});
        note = _t('txt.action_suicide_attack_desc');
      }
    }
  }

  dispatch(action({
    waiting: true,
    title: title,
    note: note,
    title_done: _t('txn.moving'),
    button: _t('txt.move_now'),
    fields_order: fieldsOrder,
    fields: {
      current: {
        text: _t('txt.your_fish'),
        value: _t('txt.your_fish_desc', {column: source.column, row: source.row, fish_id: source.current.info.fish_id, weight: source.current.info.weight}),
        readonly: true,
        type: 'text',
      },
      energy: {
        text: _t('txt.energy_used_to_move'),
        value: `${energy} EMONT`,
        readonly: true,
        type: 'text',
      },
      new_weight: {
        text: _t('txt.fish_weight_before_entering'),
        value: `${newWeight} EMONT`,
        readonly: true,
        type: 'text',
      },
      estimated_loss: {
        text: _t('txt.estimated_loss'),
        value: `${-source.current.info.weight_bonus} EMONT`,
        readonly: true,
        type: 'text',
      },
      estimated_bonus: {
        text: _t('txt.estimated_bonus'),
        value: `${source.current.info.weight_bonus} EMONT`,
        readonly: true,
        type: 'text',
      },
      estimated_new_weight: {
        text: _t('txt.estimated_new_weight'),
        value: `${newWeight+source.current.info.weight_bonus} EMONT`,
        readonly: true,
        type: 'text',
      },
      destination: {
        text: _t('txt.destination'),
        value: desc,
        readonly: true,
        type: 'text',
      },
      extra: {fromPos, toPos, target},
    },
    submitFunc: function(obj, callback) {
      // Validating Data
      if (obj.extra.fromPos === window.OCEAN_BASE_POS && obj.extra.target.current.isFish) {
        callback({'err': _t('err.cannot_attack_at_base')});
        return;
      }

      // Bind callback
      this.callback = callback;

      // Sending Txn
      window.moveFish(obj.extra.fromPos, obj.extra.toPos, defaultCallbackFunction.bind(this));
    },
    onFinishCallback: function(data) {
      finishCallback && finishCallback(data);
    },

  }));
};

export const CashOut = (dispatch, action, _t, {weight}, finishCallback) => {
  dispatch(action({
    waiting: true,
    title: _t('txt.confirm_to_cash_out'),
    // note: _t('txt.cash_out_note'),
    title_done: _t('txn.cashing_out'),
    button: _t('txt.cash_out'),
    fields_order: weight >= window.MIN_WEIGHT_CASH_OUT
      ? ['required_weight', 'weight', 'new_weight', 'your_amount']
      : ['required_weight', 'weight'],
    fields: {
      required_weight: {
        text: _t('txt.required_weight_cash_out'),
        value: `${window.MIN_WEIGHT_CASH_OUT} EMONT`,
        readonly: true,
        type: 'text',
      },
      weight: {
        text: _t('txt.your_fish_weight'),
        value: `${weight} EMONT`,
        readonly: true,
        type: 'text',
      },
      new_weight: {
        text: _t('txt.new_fish_weight'),
        value: `${window.DEFAULT_FISH_WEIGHT} EMONT`,
        readonly: true,
        type: 'text',
      },
      your_amount: {
        text: _t('txt.emont_sent_to_your_wallet'),
        value: `${(weight - window.DEFAULT_FISH_WEIGHT) * CASH_OUT_RATE / 100} EMONT`,
        readonly: true,
        type: 'text',
      },

      extra: {weight: weight, amount: (weight - window.DEFAULT_FISH_WEIGHT) * CASH_OUT_RATE / 100},
    },
    submitFunc: function(obj, callback) {
      // Validating Data
      if (obj.extra.weight < window.MIN_WEIGHT_CASH_OUT) {
        callback({'err': _t('err.cashout_underweight')});
        return;
      }

      // Bind callback
      this.callback = callback;

      // Sending Txn
      window.cashOut(defaultCallbackFunction.bind(this));
    },
    onFinishCallback: function(data) {
      finishCallback && finishCallback(data);
    },

  }));
};