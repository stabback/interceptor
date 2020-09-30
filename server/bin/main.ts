import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '..', '..', '.env'),
});

/* eslint-disable no-console,import/first */
import readline from 'readline';
import app from '@server/app';
import http from 'http';
import chalk from 'chalk';
import { dbLoader } from '@server/loaders/db';
import { normalizePort } from '@server/utils/normalize-port/normalize-port';

async function main() {
  console.log(chalk.bold.cyan('Starting Interceptor...'));

  /**
   * Get port from environment and store in Express.
   */
  const port = normalizePort(process.env.PORT || '8080');
  app.set('port', port);

  console.log(chalk.cyan('\tPort '), chalk.green(port));

  /**
   * Create HTTP server.
   */
  const server = http.createServer(app);
  console.log(chalk.cyan('\tServer '), chalk.green('Created'));

  /**
   * Listen on provided port, on all network interfaces.
   */
  process.stdout.write(chalk.cyan('\tDatabase ') + chalk.green('Connecting...'));

  try {
    await dbLoader();
    readline.clearLine(process.stdout, (0));
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${chalk.cyan('\tDatabase', chalk.green('Connected'))}\n`);
  } catch (e) {
    readline.clearLine(process.stdout, (0));
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${chalk.cyan('\tDatabase', chalk.red.bold('Failed'))}\n`);
    console.error(e);
    process.exit(1);
  }


  process.stdout.write(chalk.cyan('\tListening') + chalk.green('Starting...'));
  server.listen(port);


  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    readline.clearLine(process.stdout, (0));
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${chalk.cyan('\tListening ') + chalk.red.bold('Failed')}\n`);

    const bind = typeof port === 'string'
      ? `Pipe ${port}`
      : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  server.on('listening', () => {
    const addr = server.address();

    let bind = '[Unknown]';

    if (addr) {
      bind = typeof addr === 'string'
        ? addr
        : `${addr.port}`;
    }

    readline.clearLine(process.stdout, (0));
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${chalk.cyan('\tListening', chalk.green('Listening!'))}\n`);

    console.log('');
    console.log(chalk.green.bold(`Interceptor started on http://localhost:${bind}`));
  });
}

main();
