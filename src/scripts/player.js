class Player {
  constructor(name) {
    this.name = name;
    this.score = 0;
    this.rules = [];                                                                                                                                                                                                                                                                                                                                                          
  }

  addScore(points) {
    this.score += points;
  }
}
