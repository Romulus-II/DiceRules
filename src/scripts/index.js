const MAX_RULES = 3;

const COMMON_RULES_PROB = 70;
const RARE_RULES_PROB = 25;
const LEGENDARY_RULES_PROB = 5;

var num_common_rules_used = 0;
var num_rare_rules_used = 0;
var num_legendary_rules_used = 0;

var used_rules = [];
var active_rules = [];

var PLAYERS = [];
var player_index = 0;

var action_performed = false;
var mid_roll = false;

var DIE_1;
var DIE_2;

const CAN_WIN = true; // for development purposes
const WINNING_SCORE = 300;
var game_won = false;

function adjustLayout() {
  // Check if page width is greater than page height
  if (window.innerWidth > window.innerHeight) {
    $('#player-scoreboard').addClass("quarter-split");
    $('#player-rules-board').addClass("half-split");
    $('#player-placeholder').addClass("quarter-split");
  } else {
    $('#player-scoreboard').addClass("full");
    $('#player-rules-board').addClass("full");
  }

  console.log($('#player-scoreboard').height() + ' v/s ' + ($('#player-rules-board').height()*8));
  if ($('#player-scoreboard').height() > ($('#player-rules-board').height()*9)) {
    $('#placeholder').height($('#player-scoreboard').height());
  } else {
    $('#placeholder').height(($('#player-rules-board').height()*9));
  }
}

function adjustScore(score, rule) {
  if (rule.action == 'x') {
    return Math.ceil(score * rule.value);
  } else if (rule.action == '+') {
    return (score + rule.value);
  } else if (rule.action == '-') {
    return (score - rule.value);
  } else if (rule.action == '=') {
    return value;
  }
}

function calculateScore(player) {
  console.log('Calculating ' + player.name + "'s score");

  parsed_active_rules = [];
  for (var i = 0; i < active_rules.length; i++) {
    var parsed_rules = parseRule(active_rules[i]);
    for (var j = 0; j < parsed_rules.length; j++) {
      parsed_active_rules.push(parsed_rules[j]);
    }
  }
  //console.log(parsed_active_rules);
  if (parsed_active_rules.length > 1) {
    parsed_active_rules = sortParsedRules(parsed_active_rules);
  }
  //console.log(parsed_active_rules);

  rollDice();

  var score = DIE_1.value + DIE_2.value;
  console.log(player.name + ' rolled a ' + score);
  for (var i = 0; i < parsed_active_rules.length; i++) {
    if (inTarget(parsed_active_rules[i], DIE_1, DIE_2)) {
      console.log('Adjusting score');
      score = adjustScore(score, parsed_active_rules[i]);
    }
  }

  prev_score = player.score;
  console.log('With the current rules, this comes out to a ' + score);
  player.score = prev_score + score;

  if (CAN_WIN) {
    if (player.score >= WINNING_SCORE) {
      game_won = true;
      alert(player.name + ' has won!');
    }
  }
}

function createGameDisplay(players) {
  var game_area = document.getElementById('game-area');

  var scoreboard = '\n<div id="player-scoreboard">';
  scoreboard += '\n<table id="player-scoreboard-table">';
  for (var i = 0; i < players.length; i++) {
    scoreboard += '\n  <tr id="' + players[i].name + '">';
    scoreboard += '\n    <td class="player-name">' + players[i].name + '</td>';
    scoreboard += '\n    <td class="player-points" id="score-' + players[i].name + '">' + players[i].score + '</td>'
    scoreboard += '\n  </tr>';
  }
  scoreboard += '\n</table>';
  scoreboard += '\n</div>';

  game_area.innerHTML += scoreboard;

  var player_rules_board = '\n<div id="player-rules-board">';
  player_rules_board += '\n<table id="player-rules-board-table">'
  for (var i = 0; i < MAX_RULES; i++) {
    player_rules_board += '\n  <tr>';
    player_rules_board += '\n    <td class="rule"></td>';
    player_rules_board += '\n  </tr>';
  }
  player_rules_board += '\n</table>';
  player_rules_board += '\n</div>';

  game_area.innerHTML += player_rules_board;

  game_area.innerHTML += '<div id="player-placeholder"></div>';

  game_area.innerHTML += '<p id="placeholder"> </p>';

  var dice_area = '\n<div class="full" id="dice-area">';
  dice_area += '\n<button id="roll-button" onclick="roll()">Roll</button>';
  dice_area += '\n</div>';

  game_area.innerHTML += dice_area;

  rules_board = '\n<p id="active-rules-board">Active Rules:</p>';
  rules_board += '\n<div class="full" id="active-rules-display">';
  rules_board += '\n<table id="active-rules-board">';
  rules_board += '\n</table>';
  rules_board += '\n</div>';

  game_area.innerHTML += rules_board;
}

function generatePlayerRules(player) {
  remaining_rules = MAX_RULES - player.rules.length;
  console.log('Fetching ' + remaining_rules + ' rules.')

  while (remaining_rules != 0) {
    if (used_rules.length == (all_common_rules.length+all_rare_rules.length+all_legendary_rules.length)) { return; }

    var rule_selected = false;
    var random = Math.floor(Math.random() * 100);

    if (random < COMMON_RULES_PROB && num_common_rules_used != all_common_rules.length) {
      while (!rule_selected) {
        var rand_rule_index = Math.floor(Math.random() * all_common_rules.length);
        if (!used_rules.includes(all_common_rules[rand_rule_index])) {
          var rule = all_common_rules[rand_rule_index];
          player.rules.push(rule);
          used_rules.push(rule);
          num_common_rules_used++;
          rule_selected = true;
          remaining_rules--;
        }
      }
    } else if (random < (COMMON_RULES_PROB+RARE_RULES_PROB) && num_rare_rules_used != all_rare_rules.length) {
      while (!rule_selected) {
        var rand_rule_index = Math.floor(Math.random() * all_rare_rules.length);
        if (!used_rules.includes(all_rare_rules[rand_rule_index])) {
          var rule = all_rare_rules[rand_rule_index];
          player.rules.push(rule);
          used_rules.push(rule);
          num_rare_rules_used++;
          rule_selected = true;
          remaining_rules--;
        }
      }
    } else if (num_legendary_rules_used != all_legendary_rules.length) {
      while (!rule_selected) {
        var rand_rule_index = Math.floor(Math.random() * all_legendary_rules.length);
        if (!used_rules.includes(all_legendary_rules[rand_rule_index])) {
          var rule = all_legendary_rules[rand_rule_index];
          player.rules.push(rule);
          used_rules.push(rule);
          num_legendary_rules_used++;
          rule_selected = true;
          remaining_rules--;
        }
      }
    }
  }
}

function highlightPlayer(player_name) {
  $('#' + player_name).addClass("highlighted");
}

function inTarget(rule, die_1, die_2) {
  if(rule.target == 'all') {
    return true;
  } else if (rule.target == 'even' && even(DIE_1, DIE_2)) {
    return true;
  } else if (rule.target == 'odd' && odd(DIE_1, DIE_2)) {
    return true;
  } else if (rule.target == 'matching_pairs' && matching(DIE_1, DIE_2)){
    return true;
  } else if (rule.target.includes('value')) {
    var index = rule.target.indexOf(' ');
    var value_str = rule.target.substring(index+1);
    var value = Number.parseInt(value_str);
    if (value == (DIE_1.value + DIE_2.value)) { return true; }
    else { return false; }
  } else {
    return false;
  }
}

function rollDice() {
  DIE_1.roll();
  DIE_2.roll();
}

function roll() {
  if (game_won) { return; }
  if (mid_roll) { return; }

  calculateScore(PLAYERS[player_index]);

  if (!game_won) {
    player_index++;
    if (player_index == PLAYERS.length) { player_index = 0; }
    mid_roll = true;

    setupTurn();
  } else {
    showPlayerScores();
  }
}

function startGame(num_players, names) {
  DIE_1 = new Die();
  DIE_2 = new Die();
  PLAYERS = [];

  game_won = false;
  mid_roll = false;
  action_performed = false;

  for (var i = 0; i < num_players; i++) {
    PLAYERS.push(new Player(names[i]));
  }

  num_common_rules_used = 0;
  num_rare_rules_used = 0;
  num_legendary_rules_used = 0;
  used_rules = [];
  active_rules = [];
  player_index = 0;

  createGameDisplay(PLAYERS);

  adjustLayout();
  setupTurn();
}

function setupTurn() {
  unhighlightAllPlayers();
  generatePlayerRules(PLAYERS[player_index]);
  console.log(PLAYERS[player_index].name + ' has ' + PLAYERS[player_index].rules.length + ' available rules');
  console.log(PLAYERS[player_index].rules);

  showPlayerScores();
  showPlayerRules();

  highlightPlayer(PLAYERS[player_index].name);
  action_performed = false;
  mid_roll = false;

  console.log('Finished setting up the board for ' + PLAYERS[player_index].name)
}

function showPlayerRules() {
  var res = document.getElementById('player-rules-board');
  var content = '\n<p id="player-rules-board-header">Available Rules:</p>';
  content += '\n<table id="player-rules-board-table">'
  for (var i = 0; i < PLAYERS[player_index].rules.length; i++) {
    content += '\n  <tr>';
    content += '\n    <td><button class="add-rule" onclick="addActiveRule(' + (i) + ')">+</button></td>';
    content += '\n    <td><button class="remove-rule" onclick="removePlayerRule(' + (i) + ')">-</button></td>'
    content += '\n    <td class="' + PLAYERS[player_index].rules[i].rarity + '-rule" id="' + i + '">' + PLAYERS[player_index].rules[i].content + '</td>';
    content += '\n  </tr>';
  }
  content += '\n</table>';
  res.innerHTML = content;
}

function showPlayerScores() {
  var res = document.getElementById('player-scoreboard');
  var content = '<table id="player-scoreboard-table">';
  for (var i = 0; i < PLAYERS.length; i++) {
    content += '\n  <tr id="' + PLAYERS[i].name + '">';
    content += '\n    <td class="player-name">' + PLAYERS[i].name + '</td>';
    content += '\n    <td class="player-points" id="score-' + PLAYERS[i].name + '">' + PLAYERS[i].score + '</td>'
    content += '\n  </tr>';
  }
  content += '\n</table>';
  res.innerHTML = content;
}

function showActiveRules() {
  var res = document.getElementById('active-rules-display');
  var content = '\n<table id="active-rules-board">';
  for (var i = 0; i < active_rules.length; i++) {
    content += '\n  <tr>';
    content += '\n    <td><button class="remove-rule" onclick="removeActiveRule(' + (i) + ')">-</button></td>'
    content += '\n    <td class="' + active_rules[i].rarity + '-rule">' + active_rules[i].content + '</td>';
    content += '\n  </tr>';
  }
  content += '\n</table>';

  res.innerHTML = content;
}

function unhighlightAllPlayers() {
  for (var i = 0; i < PLAYERS.length; i++) {
    $('#' + PLAYERS[i].name).removeClass("highlighted");
  }
}

//var registered_players = ["Gabe", "May", "Christian", "Hailey", "Liana"];
var registered_players = ["Gabe", "May"];
startGame(registered_players.length, registered_players);
