import { model, Schema } from "mongoose";

const jointSchema = new Schema(
  {
    name: String,
    description: String,
    type: [Schema.Types.ObjectId],
    email: String,
    address: String,
    images: [String],
    location: String,
    phoneNumber1: String,
    phoneNumber2: String,
    menu: [Schema.Types.ObjectId],
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
