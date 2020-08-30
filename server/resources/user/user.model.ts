import {
  createSchema, Type, typedModel, ExtractDoc, ExtractProps,
} from 'ts-mongoose';
import { serializeDocument } from '@server/utils';
import { SerializedDocument } from '@definitions';

export const UserSchema = createSchema({
  intercepts: Type.mixed({ required: true, default: {} }),
  // { [key Intercept.id]: Response.id | null }
  key: Type.string({ required: true, unique: true }),
}, {
  minimize: false,
});

interface SerializedUserData {
  intercepts: {
    [key: string]: string;
  };
  key: UserProps['key'];
}

UserSchema.methods.toJSON = function toJSON(
  this: UserDocument,
) {
  const data: SerializedUserData = {
    key: this.key,
    intercepts: this.intercepts,
  };

  return serializeDocument(this, data);
};

export const User = typedModel('User', UserSchema);
export type UserDocument = ExtractDoc<typeof UserSchema>
export type UserProps = ExtractProps<typeof UserSchema>
export type SerializedUser = SerializedDocument<SerializedUserData>

export interface UserInterceptSetting {
  intercept: string;
  response: string;
}
