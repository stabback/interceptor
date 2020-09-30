/* eslint-disable import/no-extraneous-dependencies */
// Dev script, these packages should be dev

import chalk from 'chalk';
import concurrently from 'concurrently';

// tslint:disable: no-trailing-whitespace
const message = `
                                                
   Starting Interceptor in dev mode             
   http://localhost:8080                        
                                                
`;
const warning = `
   Ignore the Vue startup message.         
   Access with the link above.             
`;
// tslint:enable: no-trailing-whitespace

console.log(chalk.bgWhite.black(message));
console.log(chalk.bgYellow.black(warning));

concurrently([
  {
    command: 'yarn dev:server',
    name: 'server',
    prefixColor: 'bgMagenta.black',
  },
  {
    command: 'yarn dev:client',
    name: 'client',
    prefixColor: 'bgGreen.black',
  },
]);
