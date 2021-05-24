class Die {
  constructor() {
    this.value = 1;
  }

  roll() {
    var roll = Math.floor(Math.random() * 6) + 1;
    this.value = roll;
  }
}
