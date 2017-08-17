import { MyGame } from './game/game';
import * as Phaser from 'phaser-ce';
// import { Joysticker } from '../engine/plugins/joysticker';

// const APP_HEIGHT = 800;
// const APP_WIDTH = 1240;

export class App {
  private _game: MyGame;

  constructor(private ele: HTMLElement) {
    if (!ele) throw new Error('root element is not given');
    ele.innerHTML = '';

    let btn = document.createElement('button');
    btn.innerText = '开始游戏';
    btn.addEventListener('click', this.startGame.bind(this));
    ele.appendChild(btn);
    // const GAME_OPTS = {
    //   width: APP_WIDTH,
    //   height: APP_HEIGHT,
    //   renderer: Phaser.CANVAS,
    //   parent: ele,
    //   state: {
    //     preload: this._preload.bind(this),
    //     create: this._create.bind(this),
    //   },
    //   transparent: false,
    // }
    
    // this._game = new Phaser.Game(
    //   GAME_OPTS.width,
    //   GAME_OPTS.height,
    //   GAME_OPTS.renderer,
    //   GAME_OPTS.parent,
    //   GAME_OPTS.state,
    //   GAME_OPTS.transparent,
    // );

    // this._game.state.add('Play', GAME_OPTS.state);
  }

  private startGame() {
    this.ele.innerHTML = '';

    if (!document.fullscreenElement
      && !document['mozFullScreenElement']
      && !document.webkitFullscreenElement
      && !document['msFullscreenElement']
    ) {
      // var requestFullScreen = this.ele.requestFullscreen
      //   || this.ele['mozRequestFullScreen']
      //   || this.ele.webkitRequestFullScreen
      //   || this.ele['msRequestFullscreen'];
      // requestFullScreen.call(this.ele);

      setTimeout(() => {
        this._game = new MyGame(this.ele);
      }, 1000);
    }
  }

  // private _preload() {
  //   this._firstRunLandscape = this._game.scale.isGameLandscape;
  //   this._game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
  //   this._game.scale.setResizeCallback(() => {
  //     this._game.scale['setMaximum']();
  //   }, this);
  //   this._game.world.resize(APP_WIDTH, APP_HEIGHT);
    
  //   if (!this._game.device.desktop) {
  //     this._game.scale.forceOrientation(true, false);
  //     this._game.scale.enterIncorrectOrientation.add(this.handleIncorrect, this);
  //     this._game.scale.leaveIncorrectOrientation.add(this.handleCorrect, this);
  //   }
    
  //   this._game.load.image('logo', 'assets/images/logo.png');
  //   this._game.load.image('compass', 'assets/images/compass_rose.png');
  //   this._game.load.image('touch_segment', 'assets/images/touch_segment.png');
  //   this._game.load.image('touch', 'assets/images/touch.png');
  // }

  // private _create() {
  //   var logo = this._game.add.sprite(this._game.world.centerX, this._game.world.centerY, 'logo');
  //   logo.anchor.setTo(0.5, 0.5);
  //   logo.scale.setTo(0.2, 0.2);

  //   this._game.stage.scale['startFullScreen']();
  //   this._game.stage.scale['setShowAll']();
  //   this._game.stage.scale['refresh']();

  //   this._game.add.tween(logo.scale).to({ x: 1, y: 1 }, 2000, Phaser.Easing.Bounce.Out, true);
  //   this._initStickers();
  // }

  // private _initStickers() {
  //   let joystickerInitPoint: Phaser.Point = new Phaser.Point(70, APP_HEIGHT - 70);
    
  //   this._joysticker = this._game.plugins.add(Joysticker);
  //   this._joysticker.inputEnable();
  //   this._joysticker.setInitialPoint(joystickerInitPoint);
  // }

  // private handleIncorrect() {
  //   if (!this._game.device.desktop) {
  //     if (!document.getElementById('turn')) return;
  //     document.getElementById('turn').style.display = 'block';
  //   }
  // }
  
  // private handleCorrect() {
  //   debugger;
  //   if (!this._game.device.desktop) {
  //     if (!this._firstRunLandscape) {
  //       let gameRatio = window.innerWidth / window.innerHeight;
  //       let width = Math.ceil(APP_HEIGHT * gameRatio);
  //       let height = APP_HEIGHT;
  //       this._game.scale['setShowAll']();
  //       this._game.scale.refresh();
  //       this._game.scale['setMaximum']();
  //       this._game.scale['setScreenSize'](true);
  //       this._game.scale.startFullScreen(false);
  //     }
  //     document.getElementById("turn").style.display = "none";
  //   }
  // }
}
