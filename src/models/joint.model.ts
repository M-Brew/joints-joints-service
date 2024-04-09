import { model, Schema } from "mongoose";

const imageSchema = new Schema({
  imageURL: String,
  key: String
})

const jointSchema = new Schema(
  {
    name: String,
    slug: String,
    description: String,
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "JointType",
      },
    ],
    address: String,
    avatar: imageSchema,
    gallery: [imageSchema],
    latitude: Number,
    longitude: Number,
    phone: [String],
    menu: [
      {
        type: Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
    createdBy: Schema.Types.ObjectId,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const jointModel = model("Joint", jointSchema);

export default jointModel;
