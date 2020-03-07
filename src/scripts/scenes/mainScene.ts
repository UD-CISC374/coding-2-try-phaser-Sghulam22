import ExampleObject from '../objects/beam';
import { throws } from 'assert';
import { position } from '../game';
import beam from '../objects/beam';
import { threadId } from 'worker_threads';



export default class MainScene extends Phaser.Scene {
  private beam: beam;

  //adding types to each var(images)
  background: Phaser.GameObjects.TileSprite; 
  player: Phaser.GameObjects.Sprite; 
  ship: Phaser.GameObjects.Image;
  ship2: Phaser.GameObjects.Image;
  ship3: Phaser.GameObjects.Image;
  ship4: Phaser.GameObjects.Image;
  
  keys: Phaser.Types.Input.Keyboard.CursorKeys;
  spacebar: Phaser.Input.Keyboard.Key;
  bullets: Array<beam> =[];
  timer:number;  
  temp:Date;
  sec:number;
  speed:number;
  speed2:number;
  speed3:number;
  speed4:number;
  shipArr: Array<Phaser.GameObjects.Image> =[]
  enemies: Phaser.Physics.Arcade.Group;
  speed1:number=4;
  life:number;
  score:number;
 
  healthlabel: Phaser.GameObjects.Text;
  scorelabel: Phaser.GameObjects.Text;
  shot: Phaser.Sound.BaseSound;
  hit: Phaser.Sound.BaseSound;



  constructor() {
    super({ key: 'MainScene' });
  }

  create() {

    this.speed=5;
    this.speed2=4;
    this.speed3=4.5;
    this.speed4=6;
    this.life=3;
    this.score=0;

    let d = new Date();
    this.sec=d.getSeconds();
    
    this.timer=1;

    //this sets the background to keep moving
    this.background = this.add.tileSprite(0,0,626,352,"background");
    this.background.setOrigin(0,0);
    

    //loading all the images to the game
    this.ship=this.physics.add.image(Phaser.Math.Between(1200,1500),Phaser.Math.Between(100,300),"spaceship");
    this.ship2=this.physics.add.image(Phaser.Math.Between(1500,2000),Phaser.Math.Between(100,300),"spaceship");
    this.ship3=this.physics.add.image(Phaser.Math.Between(2000,2500),Phaser.Math.Between(100,300),"spaceship");
    this.ship4=this.physics.add.image(Phaser.Math.Between(1000,2000),Phaser.Math.Between(100,300),"spaceship");
    this.player = this.physics.add.sprite(110,150,"player",0)
    this.shot = this.sound.add("shot");
    this.hit = this.sound.add("hit");

    this.player.setSize(20,70);

    this.shipArr.push(this.ship);
    this.shipArr.push(this.ship2);
    this.shipArr.push(this.ship3);
    this.shipArr.push(this.ship4);

    this.enemies = this.physics.add.group();
    this.enemies.add(this.ship);
    this.enemies.add(this.ship2);
    this.enemies.add(this.ship3);
    this.enemies.add(this.ship4);

    
    this.ship.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();
    this.ship4.setInteractive();

    this.physics.world.setBoundsCollision();

    this.keys = this.input.keyboard.createCursorKeys();
    this.spacebar= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
   
    //editing the picture sizes
    this.ship.setScale(.15);
    this.ship2.setScale(.15);
    this.ship3.setScale(.15);
    this.ship4.setScale(.15);    
    this.player.setScale(.2);

     this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer,undefined,this);
     this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy,undefined,this);
  }

  
  async update() {

    let d = new Date();
    //this.shot.play();
    //this moves the background
    this.background.tilePositionX +=2;
   
    //this function calls repeatedly move the ships to the left. the second param is the speed.
    this.moveObject(this.ship,this.speed);
    this.moveObject(this.ship2,this.speed2);
    this.moveObject(this.ship3,this.speed3);
    this.moveObject(this.ship4,this.speed4);

    //moves the player up or down based on key press
    this.playerMoves(this.player,this.keys);  
  

    //make sure the player shoots every .3 secs
    if(this.shoot(this.keys)==true && ((d.getMilliseconds()-this.sec)>400 || this.sec > d.getMilliseconds()))
    {
      this.bullets[this.bullets.length] = new beam(this,this.player.x,this.player.y).setScale(.05);
      this.temp = new Date();
      this.sec=this.temp.getMilliseconds();  
      this.shot.play(); 
    }

    
    //moves all the bullets
    for (let i = 0; i < this.bullets.length; i++) {
      this.moveLaser(this.bullets[i]);
    }
    

    //checks if bullet has passed the boundary
    for(let i=0;i<this.bullets.length;i++)
    {
      if(this.bullets[i].x>626)
      {
        this.bullets.splice(i,i+1);
      }   
    }

    //makes sure player is with in bounds
    if(this.player.y<50)
      this.upbounds(this.player)

    if(this.player.y>270)
      this.lowerbounds(this.player);



    //checks if the objects have touched the left of the screen to reset position
    if(this.ship.x<0){
      this.resetObject(this.ship,this.speed);
    }

    if(this.ship2.x<0){
      this.resetObject(this.ship2,this.speed2);
    }

    if(this.ship3.x<0){
      this.resetObject(this.ship3,this.speed3);
    }

    if(this.ship4.x<0){
      this.resetObject(this.ship4,this.speed4);
    }

   }

  //function that gets called when the enemy hits the player
  hurtPlayer(player,enemy) {
    
    player.x=100;
    player.y=150
    this.resetObject(enemy,this.speed1);
    this.life =this.life -1;
        
     if(this.life<0)
     {
        this.scene.pause("MainScene");
        this.add.text(200, 150, "game over", {
          font: "25px Arial",
          fill: "yellow"
        });
      }
    }
   
  //constantly moves player bullets
  moveLaser(laser)
  {
    laser.x+=5;
  }

  //checks if the spacebar was pressed down
  shoot(keys):boolean
  {
      if(keys.space.isDown){
          return true;
      }
      return false;
  }
  

  //moves player up or down based on key input
  playerMoves(player,keys)
  {
    if(keys.down.isDown)
      player.y+=3;
    
    if(keys.up.isDown)
      player.y-=3;
  }

 

  //move game objects to the left
  moveObject(object,speed)
  {
    object.x-=speed;
  }

  //stops the player from going off the map
  upbounds(player)
  {
    player.y=50;
  }

  //stops the player from going off the map
  lowerbounds(player)
  {
    player.y=270;
  }

  //function for resetting the floating objects to the right
   resetObject(object,speed)
  {
    let num = Phaser.Math.Between(100,280);
    object.y = num;
    object.x = Phaser.Math.Between(800,1500);
    speed=  Phaser.Math.Between(6,9)
  }

  //callback function that resets object when hit
  hitEnemy(projectile, object) 
  {
    projectile.destroy();
    this.resetObject(object,this.speed1);
    this.score++;
    this.hit.play();

    if(this.score>25){
      this.scene.pause("MainScene");
      this.add.text(200, 150, "You win", {
        font: "25px Arial",
        fill: "yellow"
      });
    }

  }

  destroy(ship,speed)
  {
    this.resetObject(ship,speed);   
  }
}
