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
  life:number= 3;


  constructor() {
    super({ key: 'MainScene' });
  }

  create() {

   this.speed=5;
   this.speed2=4;
   this.speed3=4.5;
   this.speed4=6;


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


    //hitting enemy with bullet
    this.physics.add.collider(this.bullets, this.enemies, function(projectile,enemy) {
      projectile.destroy();  
    });


     this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer);
     this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy);

  }


  hurtPlayer() {
    
    this.add.text(250, 100, "game over", {
      font: "50px Arial",
      fill: "yellow"
    });

  }

  async update() {


    let d = new Date(); // for now
    d.getHours(); // => 9
    d.getMinutes(); // =>  30
    d.getSeconds(); // => 51
      
  

    //this moves the background
    this.background.tilePositionX +=2;
   

    //this function calls repeatedly move the ships to the left. the second param is the speed.
    this.moveObject(this.ship,this.speed);
    this.moveObject(this.ship2,this.speed2);
    this.moveObject(this.ship3,this.speed3);
    this.moveObject(this.ship4,this.speed4);

    // this.moveObject(this.ghost,3);
    // this.moveObject(this.rocket,4);
    // this.moveObject(this.coin,3);
    // this.moveObject(this.coin1,4);
    // this.moveObject(this.coin2,4);
    // this.moveObject(this.heart,2.9);

    //rotates the coins
    // this.coin.angle+=2;
    // this.coin1.angle+=2;
    // this.coin2.angle+=2; 

    //moves the player up or down based on key press
    this.playerMoves(this.player,this.keys);  
  

    if(this.shoot(this.keys)==true && ((d.getMilliseconds()-this.sec)>500 || this.sec > d.getMilliseconds()))
    {
      //let laser = new beam(this,this.player.x,this.player.y)

      this.bullets[this.bullets.length] = new beam(this,this.player.x,this.player.y).setScale(.05);
      this.temp = new Date();
      this.sec=this.temp.getMilliseconds();      
      console.log(this.sec);
      console.log(this.enemies.getLength);
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

  moveLaser(laser)
  {
    laser.x+=5;
   }
  shoot(keys):boolean
  {
      // this.laser = this.physics.add.image(player.x,player.y,"laser");
      // this.laser.setScale(.05)

      if(keys.space.isDown){
          //console.log("space");
          return true;
      }
      return false;
      //this.moveObject(this.laser,2);
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
    speed=  Phaser.Math.Between(4,7)
  }

  hitEnemy(projectile, enemy) {
    projectile.destroy();
    this.resetObject(enemy,this.speed1);
  }

  destroy(ship,speed)
  {
       this.resetObject(ship,speed);   
  }
}
