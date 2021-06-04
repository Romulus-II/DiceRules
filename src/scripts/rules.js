const all_common_rules = [
  {"id": 1, "rarity": "common", "content": 'x2 to all rolls'},
  {"id": 2, "rarity": "common", "content": 'x3 to all rolls'},
  {"id": 3, "rarity": "common", "content": 'x4 to all rolls'},
  {"id": 4, "rarity": "common", "content": 'x1/2 to all rolls, rounded up'},
  {"id": 5, "rarity": "common", "content": 'x1/3 to all rolls, rounded up'},
  {"id": 6, "rarity": "common", "content": 'x1/4 to all rolls, rounded up'},
  {"id": 7, "rarity": "common", "content": '+1 to all rolls'},
  {"id": 8, "rarity": "common", "content": '+2 to all rolls'},
  {"id": 9, "rarity": "common", "content": '+3 to all rolls'},
  {"id": 10, "rarity": "common", "content": '+4 to all rolls'},
  {"id": 11, "rarity": "common", "content": '+5 to all rolls'},
  {"id": 12, "rarity": "common", "content": '+6 to all rolls'},
  {"id": 13, "rarity": "common", "content": '-1 to all rolls'},
  {"id": 14, "rarity": "common", "content": '-2 to all rolls'},
  {"id": 15, "rarity": "common", "content": '-3 to all rolls'},
  {"id": 16, "rarity": "common", "content": '-4 to all rolls'},
  {"id": 17, "rarity": "common", "content": '-5 to all rolls'},
  {"id": 18, "rarity": "common", "content": '-6 to all rolls'},

  {"id": 30, "rarity": "common", "content": 'x2 to even rolls'},
  {"id": 31, "rarity": "common", "content": 'x3 to even rolls'},
  {"id": 32, "rarity": "common", "content": 'x4 to even rolls'},
  {"id": 33, "rarity": "common", "content": 'x2 to odd rolls'},
  {"id": 34, "rarity": "common", "content": 'x3 to odd rolls'},
  {"id": 35, "rarity": "common", "content": 'x4 to odd rolls'},
  {"id": 36, "rarity": "common", "content": 'x1/2 to even rolls, rounded up'},
  {"id": 37, "rarity": "common", "content": 'x1/3 to even rolls, rounded up'},
  {"id": 38, "rarity": "common", "content": 'x1/4 to even rolls, rounded up'},
  {"id": 39, "rarity": "common", "content": 'x1/2 to odd rolls, rounded up'},
  {"id": 40, "rarity": "common", "content": 'x1/3 to odd rolls, rounded up'},
  {"id": 41, "rarity": "common", "content": 'x1/4 to odd rolls, rounded up'},

  {"id": 70, "rarity": "rare", "content": '+1 to odd rolls; -1 to even rolls'},
  {"id": 71, "rarity": "rare", "content": '+2 to odd rolls; -2 to even rolls'},
  {"id": 72, "rarity": "rare", "content": '+3 to odd rolls; -3 to even rolls'},
  {"id": 73, "rarity": "rare", "content": '+4 to odd rolls; -4 to even rolls'},
  {"id": 74, "rarity": "rare", "content": '+5 to odd rolls; -5 to even rolls'},
  {"id": 75, "rarity": "rare", "content": '+1 to even rolls; -1 to odd rolls'},
  {"id": 76, "rarity": "rare", "content": '+2 to even rolls; -2 to odd rolls'},
  {"id": 77, "rarity": "rare", "content": '+3 to even rolls; -3 to odd rolls'},
  {"id": 78, "rarity": "rare", "content": '+4 to even rolls; -4 to odd rolls'},
  {"id": 79, "rarity": "rare", "content": '+5 to even rolls; -5 to odd rolls'}
];

const all_rare_rules = [
  {"id": 100, "rarity": "rare", "content": 'x2 to odd rolls; x1/2 to even rolls, rounded up'},
  {"id": 101, "rarity": "rare", "content": 'x3 to odd rolls; x1/3 to even rolls, rounded up'},
  {"id": 102, "rarity": "rare", "content": 'x4 to odd rolls; x1/4 to even rolls, rounded up'},
  {"id": 103, "rarity": "rare", "content": 'x2 to even rolls; x1/2 to odd rolls, rounded up'},
  {"id": 104, "rarity": "rare", "content": 'x3 to even rolls; x1/3 to odd rolls, rounded up'},
  {"id": 105, "rarity": "rare", "content": 'x4 to even rolls; x1/4 to odd rolls, rounded up'},
  {"id": 106, "rarity": "rare", "content": 'x5 to rolls of matching pairs'},
  {"id": 107, "rarity": "rare", "content": '+5 to rolls of matching pairs'},
  {"id": 108, "rarity": "rare", "content": '+10 to rolls of matching pairs'},
  {"id": 109, "rarity": "rare", "content": '-5 to rolls of matching pairs'},
  {"id": 110, "rarity": "rare", "content": '-10 to rolls of matching pairs'}
];

const all_legendary_rules = [
  {"id": 150, "rarity": "legendary", "content": '+70 to rolls of value 7'},
  {"id": 151, "rarity": "legendary", "content": 'x7 to rolls of value 7'},
  {"id": 152, "rarity": "legendary", "content": '+98 to rolls of value 2'},
  {"id": 153, "rarity": "legendary", "content": 'rolls of matching pairs =0'}
];

console.log('Total rules: ' + (all_common_rules.length+all_rare_rules.length+all_legendary_rules.length));

function addActiveRule(index) {
  if (game_won) { return; }
  if (action_performed) { console.log('Player already edited rules.'); return; }

  var rule;
  for(var i = 0; i < MAX_RULES; i++) {
      if (i == index) {
          rule = PLAYERS[player_index].rules[i];
          PLAYERS[player_index].rules.splice(i, 1);
      }
  }

  active_rules.push(rule);
  action_performed = true;
  showPlayerRules();
  showActiveRules();
}

function getTarget(rule_str) {
  if (rule_str.includes('all')) {
    return 'all';link
  } else if (rule_str.includes('even')) {
    return 'even';
  } else if (rule_str.includes('odd')) {
    return 'odd';
  } else if (rule_str.includes('matching pairs')) {
    return 'matching_pairs';
  } else if (rule_str.includes('value')) {
    var index = rule_str.indexOf('value');
    return (rule_str.substring(index));
  }
}

function getValue(rule_str, action) {
  var elements = rule_str.split(' '), target_found = false, index = 0;
  while (!target_found) {
    if (elements[index].includes(action)) {
      target_found = true;
      var value_str = elements[index].substring(1);
      return parseValue(value_str);
    }
    index++;
  }
}

function parseRule(rule) {
  var rules = [], parsed_rules = [];
  // If a rule has a semicolon, we have to split it up into 2 rules
  if (rule.content.includes(';')) {
    var index = rule.content.indexOf(';');
    rules.push(rule.content.substring(0,index));
    rules.push(rule.content.substring(index+1));
  } else { rules.push(rule.content); }
  for (var i = 0; i < rules.length; i++) {
    var priority, target, action, value;
    if (rules[i].includes('/')) {
      priority = 2;
      action = 'x';
    } else if (rules[i].includes('x')) {
      priority = 1;
      action = 'x';
    } else if (rules[i].includes('+')) {
      priority = 3;
      action = '+';
    } else if (rules[i].includes('-')) {
      priority = 4;
      action = '-';
    } else if (rules[i].includes('=')) {
      priority = 5;
      action = '=';
    }
    value = getValue(rules[i], action);
    target = getTarget(rules[i]);
    parsed_rules.push({'priority': priority, 'target': target, 'action': action, 'value': value});
  }
  return parsed_rules;
}

function parseValue(value_str) {
  if(value_str.includes('/')) {
    /*switch (value_str) {
      case '1/2':
        return 0.5;
        break;
      case '1/3':
        return 0.33;
        break;
      case '1/4':
        return 0.25;
        break;
      case '1/5':
        retrun
      default:

    }*/
    var index = value_str.indexOf('/');
    var numerator = Number.parseInt(value_str.substring(0,index)), denominator = Number.parseInt(value_str.substring(index+1));
    return (numerator/denominator);
  } else {
    return Number.parseInt(value_str);
  }
}

// Sort an array of parsed rules based on priority (1 -> 5)
function sortParsedRules(rules) {
  for (let i = 0; i < rules.length; i++) {
		for (let j = 0; j < rules.length-1; j++) {
			if (rules[j].priority > rules[j + 1].priority) {
				let temp = rules[j];
				rules[j] = rules[j + 1];
				rules[j + 1] = temp;
			}
		}
	}
  return rules;
}

function removeActiveRule(index) {
  if (game_won) { return; }
  if (action_performed) { console.log('Player already edited rules.'); return; }

  var rule;
  for(var i = 0; i < active_rules.length; i++) {
      if (i == index) {
          active_rules.splice(i, 1);
      }
  }

  action_performed = true;
  showActiveRules();
}
