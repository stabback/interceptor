import { Types } from 'mongoose';
import {
  User, UserDocument,
} from './user.model';

export class UserService {
  public static async create(
    key: string,
    intercepts: {
      [key: string]: string;
    } = {},
  ): Promise<UserDocument> {
    const existingUser = await User.findOne({ key });

    if (existingUser) {
      throw new Error(`Attempting to create a user with a key that already exists - ${key} - ${key}`);
    }

    const user = await User.create({
      intercepts,
      key,
    });

    await user.save();

    return user;
  }

  public static async get(id: Types.ObjectId | string): Promise<UserDocument | null> {
    if (Types.ObjectId.isValid(id)) {
      return User.findById(id);
    }
    return null;
  }

  public static async getByIdentifier(identifier: string): Promise<UserDocument | null> {
    if (Types.ObjectId.isValid(identifier)) {
      return User.findById(identifier);
    }
    return User.findOne({ key: identifier });
  }

  public static async removeByIdentifier(identifier: string): Promise<void> {
    const user = await UserService.getByIdentifier(identifier);

    if (!user) return;

    await user.deleteOne();
  }

  public static async getAll(): Promise<UserDocument[]> {
    return User.find();
  }
}

export default UserService;
