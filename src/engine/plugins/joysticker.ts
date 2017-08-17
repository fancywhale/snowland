import * as Phaser from 'phaser-ce';
import * as EventEmitter from 'events';

const MAX_DELTA = 40;

export const DIRECTION_CHANGED = 'DIRECTION_CHANGED';
export const STICKER_DOWN_CHANGED = 'STICKER_DOWN_CHANGED';
export const STICKER_MOVE = 'STICKER_MOVE';

export class Joysticker extends Phaser.Plugin {

  private input: Phaser.Input;
  private initialPoint: Phaser.Point;
  private stickerHolder: Phaser.Sprite;
  private sticker: Phaser.Sprite;
  private directionCounts: number;
  private angles: number[];
  private _direction: number = -1;
  private _isDown = false;
  private settings = {
    // max distance from itial touch
    maxDistanceInPixels: 50,
    singleDirection: false
  };
  public emitter = new EventEmitter();
  public angle = 0;
  public speed = {
    x: 0,
    y: 0
  };
  public delta = 0;

  public get isDown() {
    return this._isDown;
  }

  public get direction() {
    return this._direction;
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
    this.updateDirections(8);
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
    this.sticker.cameraOffset.x = this.initialPoint.x;
    this.sticker.cameraOffset.y = this.initialPoint.y;

    // this.sticker.input.boundsRect = new Phaser.Rectangle(this.initialPoint.x - 70, this.initialPoint.y - 70, 70, 70);
  }

  private clearData() {
    this._direction = -1;

    this.speed.x = 0;
    this.speed.y = 0;

    this.sticker.cameraOffset.x = this.initialPoint.x;
    this.sticker.cameraOffset.y = this.initialPoint.y;
    this.delta = 0;
    this.angle = 0;
    this._isDown = false;
  }

  private inputDisable() {
    // this.input.onDown.remove(this.dragStart.bind(this));
    // this.input.onUp.remove(this.dragStop.bind(this));
  }

  private dragStart() {
    this.sticker.bringToTop();
    this.sticker.cameraOffset.x = this.input.worldX;
    this.sticker.cameraOffset.y = this.input.worldY;
    this._isDown = true;
    this.emitter.emit(STICKER_DOWN_CHANGED, true);
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
      this.delta = MAX_DELTA;
    } else {
      this.sticker.cameraOffset.x = this.input.x;
      this.sticker.cameraOffset.y = this.input.y;
      this.delta = distance;
    }
    this.setDirection(angle);
    this.emitter.emit(STICKER_MOVE, this);
  }

  private dragStop() {
    this.clearData();
    this.emitter.emit(STICKER_DOWN_CHANGED, false);
  }

  private empty() {
  }

  private updateDirections(directionCounts: number) {
    this.angles = [];
    this.directionCounts = directionCounts;
    for (let i = 0; i < directionCounts; i++){
      this.angles.push(2 * Math.PI * i / directionCounts);
    }
  }

  private setDirection(angle) {
    angle = angle < 0 ? (Math.PI * 2 + angle) : angle;
    let index = Math.round(angle / (Math.PI * 2 / this.directionCounts));
    index = index >= this.directionCounts ? 0 : index;
    angle = this.angles[index];
    this.speed.x = Math.cos(angle);
    this.speed.y = Math.sin(angle);

    if (this._direction != index) {
      this._direction = index;
      this.emitter.emit(DIRECTION_CHANGED, index);
    }
    
    // angle = angle + Math.PI / 2;
    // angle = angle > Math.PI * 2 ? angle - Math.PI * 2 : angle;
    this.angle = angle;
    console.log(this.angle);
  }
}
