import { set, Document, Schema, model, Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { IBlog } from './blog';

// set('useCreateIndex', true);

interface IUser {
  username: string;
  name: string;
  passwordHash: string;
  blogs: Array<IBlog>;
}

interface IUserSchema extends IUser, Schema { };
interface IUserDocument extends IUser, Document { };

const userSchema = new Schema<IUserSchema>({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 3
  },
  name: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  blogs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)

const User = model<IUserDocument>('User', userSchema)

export default User;