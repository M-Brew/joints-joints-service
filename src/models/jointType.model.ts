import { model, Schema } from "mongoose";

const jointTypeSchema = new Schema(
  {
    name: String,
    slug: String,
    description: String,
    count: {
      type: Number,
      default: 0
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

const jointTypeModel = model("JointType", jointTypeSchema);

export default jointTypeModel;
