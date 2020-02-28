export default class beam extends Phaser.GameObjects.Image {

    
    constructor(scene: Phaser.Scene, x: number, y: number) {
        
     
        super(scene, x, y, 'beam');
        scene.add.existing(this);
        scene.physics.world.enableBody(this);
       
        }   
}
