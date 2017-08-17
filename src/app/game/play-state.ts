import { Player } from '../models/player.type';
import * as Phaser from 'phaser-ce';
import { Joysticker } from '../../engine/plugins/joysticker';
import { APP_WIDTH, APP_HEIGHT, SPEED } from '../../config';

export class PlayState extends Phaser.State {
  private _stickers: Joysticker[];
  private _player: Player;
  private _bullets: any[];

  public get stickers() {
    return this._stickers;
  }

  public preload() {
  }
  
  public create() {
    let map = this.game.add.tilemap('tile.iceland');
    map.addTilesetImage('snow_ground', 'tile.iceland.snow_ground');
    map.addTilesetImage('ice', 'tile.iceland.ice');
    let layer = map.createLayer('iceland');
    layer.resizeWorld();

    this._initStickers();

    // this.game.add.tileSprite(0, 0, APP_WIDTH, APP_HEIGHT, 'tiles.init');
    this._player = Player.factory(this.game, this.game.world.centerX, this.game.world.centerY);
    this._player.isMe = true;
    this.camera.follow(this._player.sprite);
  }

  public update() {
    this._player.update();
  }

  private _initStickers() {
    let stickPos: Phaser.Point[] = [
      new Phaser.Point(70, this.game.height - 70),
      new Phaser.Point(this.game.width - 70, this.game.height - 70),
    ];
    
    this._stickers = stickPos.map(pos => {
      let sticker = this.game.plugins.add(Joysticker);
      sticker.inputEnable();
      sticker.setInitialPoint(pos);
      return sticker;
    });
  }
}
