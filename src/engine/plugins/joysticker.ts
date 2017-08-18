import * as Phaser from 'phaser-ce';
import * as EventEmitter from 'events';

const MAX_DELTA = 40;

export const DIRECTION_CHANGED = 'DIRECTION_CHANGED';
export const STICKER_DOWN_CHANGED = 'STICKER_DOWN_CHANGED';
export const STICKER_MOVE = 'STICKER_MOVE';

export interface JoystickerState {
  isDown?: boolean;
  angle?: number;
  direction?: number;
  delta?: number;
  speed?: {
    x: number;
    y: number;
  };
}

export class Joysticker extends Phaser.Plugin {

  private input: Phaser.Input;
  private initialPoint: Phaser.Point;
  private stickerHolder: Phaser.Sprite;
  private sticker: Phaser.Sprite;

  private _currentState: JoystickerState;
  private _previousState: JoystickerState;

  private settings = {
    // max distance from itial touch
    maxDistanceInPixels: 50,
    singleDirection: false
  };
  
  public emitter = new EventEmitter();

  public get isDown() {
    return this._currentState && this._currentState.isDown;
  }

  public get currentState() {
    return this._currentState;
  }

  constructor(game, parent) {
    super(game, parent);
    this.input = this.game.input;
    this.preUpdate = this.empty;

    this.stickerHolder = this.game.add.sprite(0, 0, 'touch');
    this.sticker = this.game.add.sprite(0, 0, 'touch_segment');
    this.stickerHolder.visible = true;
    this.sticker.visible = true;

    [this.sticker, this.stickerHolder].forEach((sprite) => {
      sprite.anchor.set(0.5);
      sprite.fixedToCamera = true;
    });
  }

  public inputEnable() {
    this.sticker.inputEnabled = true;
    this.sticker.input.enableDrag();
    this.sticker.events.onDragStart.add(this.dragStart.bind(this));
    this.sticker.events.onDragStop.add(this.dragStop.bind(this));
    this.sticker.events.onDragUpdate.add(this.dragMove.bind(this));
    
    // this.stickerHolder.events.onDragStart.add(this.dragStart.bind(this));
  }

  public setInitialPoint(point: Phaser.Point) {
    this.initialPoint = point;
    this.stickerHolder.cameraOffset.x = this.initialPoint.x;
    this.stickerHolder.cameraOffset.y = this.initialPoint.y;
    this.restore();

    // this.sticker.input.boundsRect = new Phaser.Rectangle(this.initialPoint.x - 70, this.initialPoint.y - 70, 70, 70);
  }

  private restore() {
    this._savePreviousState();

    this._currentState = {
      direction: -1,
      speed: {
        x: 0,
        y: 0,
      },
      delta: 0,
      angle: 0,
      isDown: false,
    };

    // adjuct pointer position
    this.sticker.cameraOffset.x = this.initialPoint.x;
    this.sticker.cameraOffset.y = this.initialPoint.y;
  }

  private _savePreviousState() {
    if (this._currentState) {
      this._previousState = { ... this._currentState };
    } else {
      this._previousState = null;
    }
  }

  private inputDisable() {
    // this.input.onDown.remove(this.dragStart.bind(this));
    // this.input.onUp.remove(this.dragStop.bind(this));
  }

  private dragStart() {
    this._savePreviousState();
    this.sticker.bringToTop();
    this.sticker.cameraOffset.x = this.input.worldX;
    this.sticker.cameraOffset.y = this.input.worldY;
    this._currentState.isDown = true;
    this.emitter.emit(STICKER_DOWN_CHANGED, true, this._previousState);
  }

  private dragMove(pointer) {
    let deltaX = this.input.x - this.initialPoint.x;
    let deltaY = this.input.y - this.initialPoint.y;
    let angle = Math.atan2(deltaY, deltaX);
    let distance = this.initialPoint.distance(this.input.activePointer.position);
    let lockFlag = distance > MAX_DELTA;
    if (lockFlag) {
      let stickerPosition = {
        x: this.initialPoint.x + Math.cos(angle) * MAX_DELTA,
        y: this.initialPoint.y + Math.sin(angle) * MAX_DELTA,
      };
      this.sticker.cameraOffset.x = stickerPosition.x;
      this.sticker.cameraOffset.y = stickerPosition.y;
      this._currentState.delta = 1;
    } else {
      this.sticker.cameraOffset.x = this.input.x;
      this.sticker.cameraOffset.y = this.input.y;
      this._currentState.delta = distance / MAX_DELTA;
    }
    this.setDirection(angle);
    this.emitter.emit(STICKER_MOVE, this);
  }

  private dragStop() {
    this.restore();
    this.emitter.emit(STICKER_DOWN_CHANGED, false, this._previousState);
  }

  private empty() {
  }

  private setDirection(angle) {
    angle = angle < 0 ? (Math.PI * 2 + angle) : angle;
    this._currentState.speed = {
      x: Math.cos(angle),
      y: Math.sin(angle)

    };

    this.emitter.emit(DIRECTION_CHANGED);;
    this._currentState.angle = angle;
  }
}
