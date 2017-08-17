import * as Phaser from 'phaser-ce';
import { _Base } from './_base.type';

export class Bullet extends _Base {

  public static factory(speed: number, angle: number, game: Phaser.Game, x: number, y: number, group: Phaser.Group) {
    let sprite = game.add.sprite(x, y, 'bullet', undefined, group);
    return new Bullet(game, sprite, speed, angle);
  }

  constructor(
    protected _game: Phaser.Game,
    protected _sprite: Phaser.Sprite,
    protected _speed: number = 0.5,
    protected _angle: number,
  ) {
    super(_game, _sprite);
  }
  
}
