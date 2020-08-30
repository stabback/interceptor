import { Types } from 'mongoose';
import { Intercept, InterceptDocument } from './intercept.model';

export class InterceptService {
  public static async create(
    name: string,
    conditions: string[] = [],
    responses: string[] = [],
    save = true,
  ): Promise<InterceptDocument> {
    const intercept = new Intercept({
      conditions,
      defaultResponse: null,
      locked: false,
      name,
      responses,
    });

    if (save) {
      await intercept.save();
    }

    return intercept;
  }

  public static async getAll(): Promise<InterceptDocument[]> {
    return Intercept.find();
  }

  public static async get(id: Types.ObjectId | string): Promise<InterceptDocument | null> {
    if (Types.ObjectId.isValid(id)) {
      return Intercept.findById(id);
    }
    return null;
  }

  public static async remove(id: Types.ObjectId | string): Promise<void> {
    if (Types.ObjectId.isValid(id)) {
      await Intercept.findByIdAndDelete(id);
    }
  }
}

export default InterceptService;
