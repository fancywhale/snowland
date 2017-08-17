import * as Phaser from 'phaser-ce';
import { PlayState } from '../game/play-state';

export class _Base {
  protected _playState: PlayState;

  public get sprite() {
    return this._sprite;
  }

  constructor(
    protected _game: Phaser.Game,
    protected _sprite: Phaser.Sprite,
  ) { 
    this._playState = <PlayState>this._game.state.getCurrentState();
    this.onCreate();
  }

  public dispose() {
    this.onDestroy();
    this._playState = null;
    this._sprite.kill();
  }

  protected onCreate() {
    
  }

  protected onDestroy() {
    
  }

}
