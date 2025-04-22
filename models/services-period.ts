import mongoose from "mongoose";

const servicesPeriodSchema = new mongoose.Schema(
  {
    servicesPeriodByNumber: {
      type: Number,
      required: true,
    },
    servicesPeriodByWord: {
      type: String,
      required: true,
      enum: [
        "week",
        "month",
        "year",
        "day",
        "days",
        "hour",
        "hours",
        "minute",
        "minutes",
      ],
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
const ServicesPeriod =
  mongoose.models.ServicesPeriod ||
  mongoose.model("ServicesPeriod", servicesPeriodSchema);

export default ServicesPeriod;
