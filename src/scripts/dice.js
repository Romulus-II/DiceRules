class Die {
  constructor() {
    this.value = 1;
  }

  roll() {
    var roll = Math.floor(Math.random() * 6) + 1;
    this.value = roll;
  }
}

function even(die_1, die_2) {
  if ((die_1.value + die_2.value) % 2 == 0) { return true; }
  else { return false; }
}

function matching(die_1, die_2) {
  if (die_1.value == die_2.value) { return true; }
  else { return false; }
}

function odd(die_1, die_2) {
  if ((die_1.value + die_2.value) % 2 != 0) { return true; }
  else { return false; }
}
