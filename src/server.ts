import * as express from 'express';
import { APP_PORT } from './config';

const app = express();

app.get('/', function (req, res) {
  res.send('Hello World')
});

 
app.listen(APP_PORT);