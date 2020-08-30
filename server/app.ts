import express, { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import createProxyMiddleware from 'http-proxy-middleware';
import logger from 'morgan';
import path from 'path';

import callRouter from './routes/call.router';
import commandRouter from './routes/command.router';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/call', callRouter);
app.use('/command', commandRouter);

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));

  // In development mode, pass requests through to Vue's dev environment
  app.use('/ui**', createProxyMiddleware({
    changeOrigin: true,
    target: 'http://localhost:3600',
  }));

  // Pass Vue's websocket connection through
  app.use('/sockjs-node**', createProxyMiddleware({
    changeOrigin: true,
    target: 'http://localhost:3600',
    ws: true,
  }));
} else {
  // In production, serve the built SPA
  const clientDist = path.resolve(__dirname, '..', 'dist', 'client');

  app.use('/ui', express.static(clientDist));

  app.use('/ui*', (request, response) => {
    response.sendFile(path.resolve(clientDist, 'index.html'));
  });
}

// Redirect users that hit the main page
app.use(/^\/$/, (req, res) => {
  res.redirect('/ui');
});

// catch 404 and forward to error handler
app.use((req: ExpressRequest, res: ExpressResponse) => {
  res.status(404).send('Not found');
});

// TODO error handler err - don't know what type this is!
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, req: ExpressRequest, res: ExpressResponse) => {
  // set locals, only providing error in development
  // eslint-disable-next-line no-param-reassign
  res.locals.message = err.message;
  // eslint-disable-next-line no-param-reassign
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.error(err);
  res.send(`General error - ${err}`);
});

export default app;
