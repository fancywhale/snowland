import * as Phaser from 'phaser-ce';
import { _Base } from './_base.type';

export class Bullet extends _Base {

  public static bullets: Bullet[] = [];

  public static factory(speed: number, angle: number, game: Phaser.Game, x: number, y: number, group: Phaser.Group) {
    let sprite = game.add.sprite(x, y, 'bullet', undefined, group);
    game.physics.arcade.enable(sprite);
    let bullet = new Bullet(game, sprite, speed, angle);
    Bullet.bullets.push(bullet);
    return bullet;
  }

  public set speed(value) {
    this._speed = value;
    this._sprite.body.velocity.x = Math.cos(this._angle) * value;
    this._sprite.body.velocity.y = Math.sin(this._angle) * value;    
  }

  private _speed_x: number;
  private _speed_y: number;

  constructor(
    protected _game: Phaser.Game,
    protected _sprite: Phaser.Sprite,
    protected _speed: number = 0.5,
    protected _angle: number,
  ) {
    super(_game, _sprite);
    this.speed = _speed;
  }
}
