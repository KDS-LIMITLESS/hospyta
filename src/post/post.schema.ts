import { Prop, raw,  SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Schema, ObjectId } from 'mongoose';
import * as bcrypt from 'bcryptjs';


export class Post extends Document {
  image: string;                
  content: string;              
  subject: string;              
  category: 'Kidney' | 'Headache' | 'Stomach'; 
  time: Date;                   
  created_at: Date;
  upvotes: number;             
  downvotes: number;           
  views: number;               
  username: string;            
  userId: Schema.Types.ObjectId;          
}

export type postDocument = HydratedDocument<Post>


export const PostSchema = new Schema<Post>({

  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
  },

  image: { 
    type: String, 
    default: ""
  }, 

  content: { 
    type: String, 
    required: true,
    maxlength: 5000, 
  },

  subject: { 
    type: String, 
    required: true,
  },

  category: { 
    type: String, 
    enum: ['Kidney', 'Headache', 'Stomach'], 
    required: true 
  },

  time: { 
    type: Date, 
    default: Date.now, 
  },

  created_at: { 
    type: Date, 
    default: Date.now, 
  },

  upvotes: { 
    type: Number, 
    default: 0, 
  },

  downvotes: { 
    type: Number, 
    default: 0, 
  },

  views: { 
    type: Number, 
    default: 0, 
  },
});

const imageAvatars = [
  'https://images.pexels.com/photos/1237119/pexels-photo-1237119.jpeg?auto=compress&cs=tinysrgb&h=350',
  'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&h=350',
]

PostSchema.pre<Post>('save', async function(next) {

  if (!this.image) {
    const randomIndex = Math.floor(Math.random() * imageAvatars.length)
    this.image = imageAvatars[randomIndex]
  }

  next();
});


