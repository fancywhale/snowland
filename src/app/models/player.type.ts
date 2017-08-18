import { EventEmitter} from 'events';
import { PlayState } from '../game/play-state';
import * as Phaser from 'phaser-ce';
import { Bullet } from './bullet.type';
import { _Base } from './_base.type';
import { APP_WIDTH, APP_HEIGHT, SPEED } from '../../config';
import {
  DIRECTION_CHANGED,
  Joysticker,
  JoystickerState,
  STICKER_DOWN_CHANGED,
  STICKER_MOVE,
} from '../../engine/plugins/joysticker';

const directionFrames = [5, 35, 0, 15, 25, 30, 20, 10];
const directionAnimations = ['right', 'down-right', 'down', 'down-left', 'left', 'up-left', 'up', 'up-right'];

const FIRE_RANGE = 150;


export class Player extends _Base{
  private _speed: number = 100;
  private _friction: number = 0.95;
  private _shot: boolean = false;
  private _shootInterval: number = 300;
  private _isMe: boolean = false;
  private _moving: boolean = false;
  private _weapon: Phaser.Weapon;
  private _emmiter: EventEmitter = new EventEmitter;
  private _rangeSprite: Phaser.Sprite;
  private _targetSprite: Phaser.Sprite;

  private get sticker1() {
    return this._playState.stickers[1];
  }

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

  public shoot(angle: number, distance: number) {
    let xDelta = Math.cos(angle) * distance;
    let yDelta = Math.sin(angle) * distance;
    let bullet = this._weapon.fireAtXY(
      this._sprite.x + xDelta,
      this._sprite.y + yDelta,
    );
    bullet.tint = 0x000000;
    bullet.alpha = 0.4;
    bullet.body.velocity.x = xDelta / 1;
    bullet.body.velocity.y = yDelta / 1;
    bullet.body.rotation = 0;

    let originalPoint = new Phaser.Point(bullet.x, bullet.y);

    let shadow = this._game.add.sprite(0, 0, 'bullet');
    this._game.physics.arcade.enable(shadow);
    shadow.anchor.set(0.5);
    shadow.body.velocity.x = bullet.body.velocity.x;
    shadow.body.velocity.y = -300 * 1 / 2 +  bullet.body.velocity.y;
    shadow.body.gravity.y = 300;
    shadow.x = bullet.x;
    shadow.y = bullet.y;
    shadow.rotation = 0;

    bullet.update = () => {
      if (bullet.position.distance(originalPoint) >= distance) {
        shadow.kill();
        bullet.kill();
      }
    };
    
    // bullet.body.rotation = angle;
    // bullet.body.velocity.x = 300 * Math.cos(angle);
    // bullet.body.velocity.y = 300 * Math.sin(angle);
  }

  protected onCreate() {
    this._sprite.anchor.setTo(0.5, 0.5);
    this._sprite.scale.setTo(0.2, 0.2);
    this._game.physics.arcade.enable(this._sprite);
    this._game.add.tween(this._sprite.scale).to({ x: 1, y: 1 }, 2000, Phaser.Easing.Bounce.Out, true);

    this._initAnimation();
    this._initWeapon();
    this._initStickReaction();
    
  }

  private _initWeapon() {
     //  Creates 30 bullets, using the 'bullet' graphic
    let weapon = this._game.add.weapon(30, 'bullet');

    weapon.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
    weapon.bulletKillDistance = FIRE_RANGE;
    weapon.bulletSpeed = 400;
    weapon.fireRate = 300;
    weapon.trackSprite(this._sprite, -14, -14);

    this._weapon = weapon;
  }

  private _initAnimation() {
    
    this._sprite.animations.add('down', [0, 1, 2, 3, 4], 10);
    this._sprite.animations.add('right', [5, 6, 7, 8, 9], 10);
    this._sprite.animations.add('up-right', [10, 11, 12, 13, 14], 10);
    this._sprite.animations.add('down-left', [15, 16, 17, 18, 19], 10);
    this._sprite.animations.add('up', [20, 21, 22, 23, 24], 10);
    this._sprite.animations.add('left', [25, 26, 27, 28, 29], 10);
    this._sprite.animations.add('up-left', [30, 31, 32, 33, 34], 10);
    this._sprite.animations.add('down-right', [35, 36, 37, 38, 39], 10);

  }

  private _initStickReaction() {
    let sticker0 = this._playState.stickers[0];
    let sticker1 = this._playState.stickers[1];

    sticker0.emitter.on(STICKER_MOVE, (sticker: Joysticker) => {
      if (!sticker.currentState) return;
      if (sticker0.currentState.delta > 0.2) {
        this._moving = true;
        this._sprite.body.velocity.x = sticker0.currentState.speed.x * this._speed;
        this._sprite.body.velocity.y = sticker0.currentState.speed.y * this._speed;
        let animationIndex = this.getAnimationIndex(sticker0.currentState.angle);
        if (!sticker1.isDown) {
          this._sprite.frame = directionFrames[animationIndex];
          this._sprite.animations.play(directionAnimations[animationIndex], 10, true);
        }
        // this._game.physics.arcade.velocityFromRotation(sticker0.angle, this._speed, this._sprite.body.velocity);
        // this._sprite.body.velocity.copyFrom(this._game.physics.arcade.velocityFromAngle(this._sprite.angle, 200));
      } else {
        this._moving = false;
        this._sprite.body.velocity.set(0);
        this._sprite.animations.currentAnim.stop();
      }
    });

    sticker0.emitter.on(STICKER_DOWN_CHANGED, (isDown) => {
      if (!isDown) {
        if (this._sprite.animations.currentAnim) {
          this._sprite.animations.currentAnim.stop();
        }
        this._sprite.body.velocity.set(0);
        this._moving = false;
      }
    });

    sticker1.emitter.on(STICKER_DOWN_CHANGED, (isDown, previousState: JoystickerState) => {
      if (isDown) {
        this._rangeSprite = this._game.make.sprite(0, 0, 'circle');
        this._rangeSprite.anchor.setTo(0.5, 0.5);
        this._rangeSprite.scale.setTo(FIRE_RANGE / this._rangeSprite.width * 2);
        this._sprite.addChild(this._rangeSprite);

        this._targetSprite = this._game.make.sprite(0, 0, 'circle');
        this._targetSprite.anchor.setTo(0.5, 0.5);
        this._targetSprite.scale.setTo(30 / this._targetSprite.width * 2);
        this._sprite.addChild(this._targetSprite);
      } else {
        this.shoot(previousState.angle, previousState.delta * FIRE_RANGE);
        if (this._rangeSprite) {
          this._rangeSprite.kill();
        }
        if (this._targetSprite) {
          this._targetSprite.kill();
        }
      }
    });

    sticker1.emitter.on(STICKER_MOVE, () => {
      let animationIndex = this.getAnimationIndex(sticker1.currentState.angle);
      this._sprite.frame = directionFrames[animationIndex];
      if (this._targetSprite) {
        this._targetSprite.x = sticker1.currentState.delta * FIRE_RANGE * Math.cos(sticker1.currentState.angle);
        this._targetSprite.y = sticker1.currentState.delta * FIRE_RANGE * Math.sin(sticker1.currentState.angle);
      }
      
      if (this._moving) {
        this._sprite.animations.play(directionAnimations[animationIndex], 10, true);
      }
    });
  }

  protected updateMe() {
    // this._sprite.body.setZeroVelocity();
    // let deltaX = Math.round(SPEED * this._playState.stickers[0].speed.x);
    // let deltaY = Math.round(SPEED * this._playState.stickers[0].speed.y);
    // this._sprite.body.velocity.x = deltaX;
    // this._sprite.body.velocity.y = deltaY;
  }

  private getAnimationIndex(angle: number) {
    return Math.round(angle / Math.PI / 2 * 8);
  }
}
