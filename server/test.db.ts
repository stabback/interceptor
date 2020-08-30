/* eslint-disable import/no-extraneous-dependencies */
// https://dev.to/paulasantamaria/testing-node-js-mongoose-with-an-in-memory-database-32np

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { DeleteWriteOpResultObject } from 'mongodb';

export default class TestDB {
  public static mongod = new MongoMemoryServer();

  /**
   * Connect to the in-memory database.
   */
  public static connect = async () => {
    const uri = await TestDB.mongod.getConnectionString();

    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };

    await mongoose.connect(uri, mongooseOpts);
  };

  /**
   * Drop database, close the connection and stop mongod.
   */
  public static closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await TestDB.mongod.stop();
  };

  /**
   * Remove all the data for all db collections.
   */
  public static clearDatabase = async () => {
    const { collections } = mongoose.connection;
    const actions: Promise<DeleteWriteOpResultObject>[] = [];

    for (const key in collections) {
      if (collections[key]) {
        const collection = collections[key];
        actions.push(collection.deleteMany({}));
      }
    }

    await Promise.all(actions);
  };
}
