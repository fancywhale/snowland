import * as Phaser from 'phaser-ce';
import { BootState } from './boot-state';
import { PlayState } from './play-state';

export class MyGame extends Phaser.Game {
    constructor(ele: HTMLElement) {
      super(window.innerWidth, window.innerHeight, Phaser.WEBGL, ele);
      this.state.add('boot', BootState);
      this.state.add('play', PlayState);
      this.state.start('boot');
    }
}
