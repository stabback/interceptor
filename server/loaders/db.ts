import mongoose, { ConnectionOptions } from 'mongoose';

const { INTERCEPTOR_MONGO_CONNECTION_URL } = process.env;


export function dbLoader(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!INTERCEPTOR_MONGO_CONNECTION_URL) {
      reject(
        new Error('Missing environment variable - INTERCEPTOR_MONGO_CONNECTION_URL'),
      );
    }

    const MONGOOSE_OPTIONS: ConnectionOptions = {
      useNewUrlParser: true,
      connectTimeoutMS: 10000,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };

    mongoose.connect(INTERCEPTOR_MONGO_CONNECTION_URL as string, MONGOOSE_OPTIONS).catch(reject);

    mongoose.connection.once('open', () => {
      resolve();
    });
  });
}
