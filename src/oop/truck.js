/* eslint-disable require-jsdoc */
class SprinterT {
  constructor() {
    this.length = 300;
    this.width = 250;
    this.height = 170;
    this.weight = 1700;
  };
};

class SmallStraightT {
  constructor() {
    this.length = 500;
    this.width = 250;
    this.height = 170;
    this.weight = 2500;
  };
};

class LargeStraightT {
  constructor() {
    this.length = 700;
    this.width = 350;
    this.height = 200;
    this.weight = 4000;
  };
};

class TruckO {
  constructor(type) {
    if (type === 'SPRINTER') {
      this.truck = new SprinterT();
    } else if (type === 'SMALL STRAIGHT') {
      this.truck = new SmallStraightT();
    } else if (type === 'LARGE STRAIGHT') {
      this.truck = new LargeStraightT();
    }
  };

  acceptableLoad(l, w, h, we) {
    const {length, width, height, weight} = this.truck;
    if (weight < we) return false;
    else if (length < l || width < w || height < h) return false;
    else return true;
  }
};

module.exports = TruckO;
