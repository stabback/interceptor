import { Types } from 'mongoose';
import { Response, ResponseDocument } from './response.model';

export interface Header {
  name: string;
  value: string;
}

export class ResponseService {
  public static async create(
    name: string,
    body: string | undefined,
    headers: Header[] = [],
    status = 200,
    delay = 200,
  ): Promise<ResponseDocument> {
    const response = await Response.create({
      name,
      status,
      delay,
      headers,
      body,
    });

    await response.save();

    return response;
  }

  public static async getAll(): Promise<ResponseDocument[]> {
    return Response.find();
  }

  public static async get(id: Types.ObjectId | string): Promise<ResponseDocument | null> {
    if (Types.ObjectId.isValid(id)) {
      return Response.findById(id);
    }
    return null;
  }

  public static async remove(id: Types.ObjectId | string): Promise<void> {
    if (Types.ObjectId.isValid(id)) {
      await Response.findByIdAndDelete(id);
    }
  }
}

export default ResponseService;
