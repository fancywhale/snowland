import { PlayState } from '../game/play-state';
import * as Phaser from 'phaser-ce';
import { Bullet } from './bullet.type';
import { _Base } from './_base.type';
import { APP_WIDTH, APP_HEIGHT, SPEED } from '../../config';
import { DIRECTION_CHANGED, STICKER_DOWN_CHANGED, STICKER_MOVE, Joysticker } from '../../engine/plugins/joysticker';


export class Player extends _Base{
  private _speed: number = 100;
  private _friction: number = 0.95;
  private _shot: boolean = false;
  private _angle: number = 0;
  private _shootInterval: number = 300;
  private _bullets: Phaser.Group;
  private _isMe: boolean = false;
  private _moving: boolean = false;

  public set isMe(value) {
    this._isMe = value;
  }

  public static factory(game: Phaser.Game, x: number, y:number, group?: Phaser.Group) {
    let sprite = game.add.sprite(x, y, 'sprite.player', undefined, group);
    return new Player(game, sprite);
  }

  public update() {
    
    if (this._isMe) {
      this.updateMe();
    }
    
    // To make player flash when they are hit, set player.spite.alpha = 0
    // if (this._sprite.alpha < 1) {
    //   this._sprite.alpha += (1 - this._sprite.alpha) * 0.16;
    // } else {
    //   this._sprite.alpha = 1;
    // }
  }

  public shoot() {
    // Shoot bullet 
    var speed_x = Math.cos(this._sprite.rotation + Math.PI / 2) * 20;
    var speed_y = Math.sin(this._sprite.rotation + Math.PI / 2) * 20;
    // The server is now simulating the bullets, clients are just rendering bullet locations, so no need to do this anymore
    var bullet = Bullet.factory(50, this._angle, this._game, this._sprite.x, this._sprite.y, this._bullets);
    this._bullets.add(bullet);
    // bullet_array.push(bullet); 
    this._shot = true;
    // Tell the server we shot a bullet 
    // socket.emit('shoot-bullet', { x: this._sprite.x, y: this._sprite.y, angle: this._sprite.rotation, speed_x: speed_x, speed_y: speed_y })
  }

  protected onCreate() {
    let sticker0 = this._playState.stickers[0];
    let sticker1 = this._playState.stickers[1];

    this._sprite.anchor.setTo(0.5, 0.5);
    this._sprite.scale.setTo(0.2, 0.2);
    this._game.physics.arcade.enable(this._sprite);
    this._game.add.tween(this._sprite.scale).to({ x: 1, y: 1 }, 2000, Phaser.Easing.Bounce.Out, true);

    this._sprite.animations.add('down', [0, 1, 2, 3, 4], 10);
    this._sprite.animations.add('right', [5, 6, 7, 8, 9], 10);
    this._sprite.animations.add('up-right', [10, 11, 12, 13, 14], 10);
    this._sprite.animations.add('down-left', [15, 16, 17, 18, 19], 10);
    this._sprite.animations.add('up', [20, 21, 22, 23, 24], 10);
    this._sprite.animations.add('left', [25, 26, 27, 28, 29], 10);
    this._sprite.animations.add('up-left', [30, 31, 32, 33, 34], 10);
    this._sprite.animations.add('down-right', [35, 36, 37, 38, 39], 10);

    let directionFrames = [5, 35, 0, 15, 25, 30, 20];
    let directionAnimations = ['right', 'down-right', 'down', 'down-left', 'left', 'up-left', 'up', 'up-right'];
    
    this._playState.stickers[0].emitter.on(STICKER_MOVE, (sticker: Joysticker) => {
      if (sticker0.delta > 10) {
        this._sprite.body.velocity.x = sticker0.speed.x * this._speed;
        this._sprite.body.velocity.y = sticker0.speed.y * this._speed;
        let animationIndex = sticker0.direction;
        this._sprite.frame = directionFrames[animationIndex];
        this._sprite.animations.play(directionAnimations[animationIndex], 10, true);
        // this._game.physics.arcade.velocityFromRotation(sticker0.angle, this._speed, this._sprite.body.velocity);
        // this._sprite.body.velocity.copyFrom(this._game.physics.arcade.velocityFromAngle(this._sprite.angle, 200));
      } else {
        this._sprite.body.velocity.set(0);
        this._sprite.animations.currentAnim.stop();
      }
    });

    this._playState.stickers[0].emitter.on(STICKER_DOWN_CHANGED, (isDown) => {
      if (!isDown) {
        if (this._sprite.animations.currentAnim) {
          this._sprite.animations.currentAnim.stop();
        }
        this._sprite.body.velocity.set(0);
      }
    });
    
    
  }

  private updateMe() {
    // this._sprite.body.setZeroVelocity();
    // let deltaX = Math.round(SPEED * this._playState.stickers[0].speed.x);
    // let deltaY = Math.round(SPEED * this._playState.stickers[0].speed.y);
    // this._sprite.body.velocity.x = deltaX;
    // this._sprite.body.velocity.y = deltaY;
  }
}
