/* eslint-disable no-console */
import mongoose from 'mongoose';

const {
  MONGO_PROTOCOL,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOST,
  MONGO_DB,
} = process.env;

export function connect(): Promise<void> {
  return new Promise((resolve) => {
    const CONNECTION_URL = `${MONGO_PROTOCOL}://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DB}?authSource=admin`;

    const MONGOOSE_OPTIONS = {
      useNewUrlParser: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      connectTimeoutMS: 10000,
    };

    mongoose.connect(CONNECTION_URL, MONGOOSE_OPTIONS);

    mongoose.connection.once('open', () => {
      resolve();
    });
  });
}
