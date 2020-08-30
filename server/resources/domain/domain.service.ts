import { Types } from 'mongoose';
import { Domain, DomainDocument } from './domain.model';

export class DomainService {
  public static async create(
    name: string,
    url: string,
    key: string,
  ): Promise<DomainDocument> {
    // Verify that the domain key is unique
    const existingDomain = await Domain.findOne({ key });

    if (existingDomain) {
      throw new Error(`Attempting to create a domain with a key that already exists - ${key} - ${name}`);
    }

    const domain = new Domain({
      intercepts: [],
      key,
      name,
      url,
    });

    await domain.save();

    return domain;
  }

  public static async getByIdentifier(identifier: string): Promise<DomainDocument | null> {
    if (Types.ObjectId.isValid(identifier)) {
      return Domain.findById(identifier);
    }
    return Domain.findOne({ key: identifier });
  }

  public static async removeByIdentifier(identifier: string): Promise<void> {
    const domain = await DomainService.getByIdentifier(identifier);

    if (!domain) return;

    await domain.deleteOne();
  }

  public static async getAll(): Promise<DomainDocument[]> {
    return Domain.find();
  }
}

export default DomainService;
