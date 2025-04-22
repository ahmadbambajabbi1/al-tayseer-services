import mongoose from "mongoose"

const SubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      ref: "User",
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
    adminProcessor: {
      type: String,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema)
