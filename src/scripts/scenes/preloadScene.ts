import { watchFile } from "fs";
import { Sleeping } from "matter";

let str = "this is the beginnig scene";


export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    //this.load.image("background","../src/assets/background.png")
    this.load.image("background","../src/assets/jungle.jpg");
    this.load.image("bird","../src/assets/bird.png");
    this.load.image("ghost","../src/assets/ghost.png");
    this.load.image("rocket","../src/assets/rocket.png");
    this.load.image("coin","../src/assets/coin.png");
    //this.load.image("ironman","../src/assets/ironman.png")
    this.load.image("heart","../src/assets/heart.png")
    this.load.image("player","../src/assets/player.png");
    this.load.image("beam","../src/assets/laser.png")
    this.load.image("spaceship","../src/assets/spaceship.png")

  }

  create() {
    this.add.text(20,20,str);
    this.scene.start('MainScene');
  }
}
