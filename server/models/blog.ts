import { Document, Schema, model, set, Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// set('useFindAndModify', false)
// set('useCreateIndex', true);

export interface IBlog {
  title: string;
  author: string;
  url: string;
  likes: number;
  user: string | {};
  comments: Array<string>;
  id: string;
  __v: number;
}

interface BlogSchema extends Schema, IBlog { };
interface BlogModel extends Model<IBlog>, IBlog { };

const blogSchema = new Schema<BlogSchema>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  likes: { type: Number, default: 0 },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [
    { type: String, minlength: 1 }
  ]
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

blogSchema.plugin(uniqueValidator)
const Blog = model<BlogModel>('Blog', blogSchema)
export default Blog