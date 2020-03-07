import { watchFile } from "fs";
import { Sleeping } from "matter";

let str = "this is the beginnig scene";


export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    //this.load.image("background","../src/assets/background.png")
    this.load.image("background","assets/jungle.jpg");
    this.load.image("player","assets/player.png");
    this.load.image("beam","assets/laser.png")
    this.load.image("spaceship","assets/spaceship.png");
    //this.load.image("spaceship","assets/spaceship.png")
    this.load.audio("shot","assets/shot.mp3")
    this.load.audio("hit","assets/destroy.mp3")

  }

  private newMethod(): string | string[] | undefined {
    return "assets/spaceship.png";
  }

  create() {
    this.add.text(20,20,str);
    this.scene.start('MainScene');
  }
}
