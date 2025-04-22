import mongoose from "mongoose";

const servicesCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "category name is required"],
    },
    description: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Use the proper model definition pattern to avoid errors
const ServicesCategory =
  mongoose.models.ServicesCategory ||
  mongoose.model("ServicesCategory", servicesCategorySchema);

export default ServicesCategory;
