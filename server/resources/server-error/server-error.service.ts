import {
  ServerError, ServerErrorDocument,
} from './server-error.model';

export class ServerErrorService {
  public static async create(
    code: string,
    message: string,
  ): Promise< ServerErrorDocument > {
    const response = await ServerError.create({
      code,
      message,
    } as ServerErrorDocument);

    await response.save();

    return response;
  }
}

export default ServerErrorService;
