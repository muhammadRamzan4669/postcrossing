import { Schema, Model, model, models, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  _id: Types.ObjectId;

  sender: Types.ObjectId;
  recipient: Types.ObjectId;
  postcard?: Types.ObjectId;

  subject: string;
  content: string;
  isRead: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
      index: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required'],
      index: true,
    },
    postcard: {
      type: Schema.Types.ObjectId,
      ref: 'Postcard',
      default: null,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      maxlength: [200, 'Subject must not exceed 200 characters'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: [2000, 'Message must not exceed 2000 characters'],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'messages',
  }
);

// Compound indexes for efficient queries
MessageSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
MessageSchema.index({ sender: 1, createdAt: -1 });
MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ type: 1, createdAt: -1 });
MessageSchema.index({ recipient: 1, isArchived: 1, isDeleted: 1 });

const Message: Model<IMessage> = models.Message || model<IMessage>('Message', MessageSchema);

export default Message;
