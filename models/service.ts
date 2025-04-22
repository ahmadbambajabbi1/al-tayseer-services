import mongoose from "mongoose";

const ServicesSchema = new mongoose.Schema(
  {
    servicesPeriod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServicesPeriod",
      required: true,
    },
    servicesCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServicesCategory",
      required: true,
    },
    washFrequency: {
      type: Number,
      required: true,
    },
    washingFolding: {
      type: Number,
      required: true,
    },
    ironing: {
      type: String,
      default: "N/A",
    },
    maximumKg: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
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
const Services =
  mongoose.models.Services || mongoose.model("Services", ServicesSchema);

export default Services;
