import mongoose, { Model, Schema } from "mongoose";

export interface IPostcard {
  _id: mongoose.Types.ObjectId;

  sender: mongoose.Types.ObjectId;
  recipient?: mongoose.Types.ObjectId;

  title: string;
  message: string;
  image: {
    url: string;
    latitude?: number;
    longitude?: number;
    location?: string;
  };

  status: 'active' | 'registered' | 'in_transit' | 'received' | 'expired';

  senderLocation: {
    country: string;
    countryCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };

  recipientLocation?: {
    country: string;
    countryCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };

  postalCode: string;
  estimatedDistance?: number;

  sentDate: Date;
  registeredDate?: Date;
  receivedDate?: Date;
  expiryDate?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const PostcardSchema = new Schema<IPostcard>(
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
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Postcard title is required'],
      maxlength: [100, 'Title must not exceed 100 characters'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [500, 'Message must not exceed 500 characters'],
      trim: true,
    },
    image: {
      url: {
        type: String,
        required: [true, 'Image URL is required'],
      },
      latitude: {
        type: Number,
        min: -90,
        max: 90,
        default: null,
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180,
        default: null,
      },
      location: {
        type: String,
        default: null,
      },
    },
    status: {
      type: String,
      enum: ['active', 'registered', 'in_transit', 'received', 'expired'],
      default: 'active',
      index: true,
    },
    senderLocation: {
      country: {
        type: String,
        required: [true, 'Sender country is required'],
      },
      countryCode: {
        type: String,
        required: [true, 'Country code is required'],
        uppercase: true,
        length: 2,
        index: true,
      },
      coordinates: {
        latitude: {
          type: Number,
          min: -90,
          max: 90,
          default: null,
        },
        longitude: {
          type: Number,
          min: -180,
          max: 180,
          default: null,
        },
      },
    },
    recipientLocation: {
      country: {
        type: String,
        default: null,
      },
      countryCode: {
        type: String,
        uppercase: true,
        length: 2,
        default: null,
        index: true,
      },
      coordinates: {
        latitude: {
          type: Number,
          min: -90,
          max: 90,
          default: null,
        },
        longitude: {
          type: Number,
          min: -180,
          max: 180,
          default: null,
        },
      },
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
      trim: true,
      index: true,
    },
    estimatedDistance: {
      type: Number,
      default: null,
      min: 0,
    },
    sentDate: {
      type: Date,
      default: () => new Date(),
      index: true,
    },
    registeredDate: {
      type: Date,
      default: null,
    },
    receivedDate: {
      type: Date,
      default: null,
    },
    expiryDate: {
      type: Date,
      default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'postcards',
  }
);


// Compound indexes for common queries
PostcardSchema.index({ sender: 1, sentDate: -1 });
PostcardSchema.index({ recipient: 1, status: 1 });
PostcardSchema.index({ status: 1, expiryDate: 1 });
PostcardSchema.index({ isPublic: 1, sentDate: -1 });
PostcardSchema.index({ 'senderLocation.countryCode': 1, 'recipientLocation.countryCode': 1 });

const Postcard: Model<IPostcard> = mongoose.models.Postcard || mongoose.model<IPostcard>('Postcard', PostcardSchema);

export default Postcard;
