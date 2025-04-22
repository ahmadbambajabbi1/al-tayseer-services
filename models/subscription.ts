import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Services",
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentDate: {
      type: Date,
    },
    washFrequencyTotal: {
      type: Number,
      required: true,
    },
    washFrequencyUsed: {
      type: Number,
      default: 0,
    },
    washFrequencyLeft: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
    adminProcessor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);
