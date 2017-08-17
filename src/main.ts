import './engine';
import { App } from './app';
const style = require('./style.scss');

let parentEle: HTMLElement = <HTMLElement>document.getElementsByTagName('app')[0];
const app = new App(parentEle);
console.log(style);