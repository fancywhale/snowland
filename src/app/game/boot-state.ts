import { RESOURCES } from './resources.config';
import * as Phaser from 'phaser-ce';
import { APP_HEIGHT, APP_WIDTH } from '../../config';

export class BootState extends Phaser.State {
  private _direction = '1';

  public preload() {
    this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    this.world.resize(APP_WIDTH, APP_HEIGHT);
    this.world.setBounds(0, 0, APP_WIDTH, APP_HEIGHT);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this._loadResource();
  }

  public create() {
    this.state.start('play');
  }

  private _loadResource() {
    Object.keys(RESOURCES.images).forEach(key => {
      this.game.load.image(key, RESOURCES.images[key]);
    });
    this._loadTile();
    this._loadSprites();
  }

  private _loadTile() {
    Object.keys(RESOURCES.tiles).forEach(key => {
      let tileName = this._buildKey('tile', key);
      this.game.load.tilemap(tileName, RESOURCES.tiles[key].source, null, Phaser.Tilemap.TILED_JSON);
      let images = RESOURCES.tiles[key].images;
      Object.keys(images).forEach(name => {
        this.game.load.image(this._buildKey(tileName, name), images[name]);
      });
    });
  }

  private _loadSprites() {
    Object.keys(RESOURCES.sprites).forEach(key => {
      let name = this._buildKey('sprite', key);
      let data = RESOURCES.sprites[key];
      this.game.load.atlas(name, data.source, data.json);
    });
  }

  private _buildKey(...args) {
    return args.join('.');
  }
}
