class Entity {
  constructor(x, y, state) {
    this.x = x;
    this.y = y;
    this.state = state;
    this.quantity = 1;
  }

  setQuantity(quantity) {
    this.quantity = quantity;
  }
}

module.exports = Entity;
