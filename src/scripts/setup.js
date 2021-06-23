var num_players_inputted = false;

var NUM_PLAYERS;
var PLAYER_NAMES = [];

function setUpPlayerCountForm() {
  var res = document.getElementById('start-request');
  var content = '<form id="game-form">';
  content += '\n  <div id="set-up-form">';
  content += '\n    <input class="int-input" id="player-count-field" name="player-count-field" type="number" value="2"><br>';
  content += '\n    <input id="submit-button" type="submit">';
  content += '\n  </div>';
  content += '\n</form>';
  res.innerHTML = content;
}

function setUpPlayerNamesForm() {
  var res = document.getElementById('set-up-form');
  var content = '';
  for (var i = 0; i < NUM_PLAYERS; i++) {
    content += '\n    <input class="text-input" id="player-' + (i+1) + '-name" name="player-' + (i+1) + '-name" type="text"><br>';
  }
  content += '\n    <input id="submit-button" type="submit">';
  res.innerHTML = content;
}

$(document).ready(function() {
  $('#game-form').on('submit', function(event) {
    event.preventDefault();

    if (!num_players_inputted) {
      var values = {};
      $.each($(this).serializeArray(), function (i, field) {
          values[field.name] = field.value;
      });

      //console.log(values["player-count-field"]);
      NUM_PLAYERS = parseInt(values["player-count-field"], 10);
      num_players_inputted = true;
      setUpPlayerNamesForm();
    } else {
      PLAYER_NAMES = [];

      $.each($(this).serializeArray(), function (i, field) {
          PLAYER_NAMES.push(field.value);
      });
      //console.log(PLAYER_NAMES);
      //var registered_players = ["Gabe", "May"];
      startGame(PLAYER_NAMES.length, PLAYER_NAMES);

      $('#start-request').hide();
      $('#game-area').show();
      num_players_inputted = false;
    }

    //$("#submit-button").attr("disabled", false);
    return false;
  });

  /*$('#game-form-2').on('submit', function(event) {
    event.preventDefault();

    alert('We are doing something!');
    console.log('YAAAAAAA, BOIIII');

    $.each($(this).serializeArray(), function (i, field) {
        PLAYER_NAMES.push(field.value);
    });
    console.log('We got some names!');
    console.log(PLAYER_NAMES);

    num_players_inputted = false;

    return false;
  });*/
});

setUpPlayerCountForm();
$('#game-area').hide();
