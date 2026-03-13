const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema(
  {
    totalVisitCount: {
      type: Number,
      default: 0,
    },
    uniqueVisitorCount: {
      type: Number,
      default: 0,
    },
    posterPageViewCount: {
      type: Number,
      default: 0,
    },
    ProfilePageViewCount: {
      type: Number,
      default: 0,
    },
    GifPageViewCount: {
      type: Number,
      default: 0,
    },
    StickerPageViewCount: {
      type: Number,
      default: 0,
    },
    FilterPageViewCount: {
      type: Number,
      default: 0,
    },
    AddYoursPageViewCount: {
      type: Number,
      default: 0,
    },
    totalPosterCreateCount: {
      type: Number,
      default: 0,
    },
    totalProfileCreateCount: {
      type: Number,
      default: 0,
    },
    totalGifDownloadCount: {
      type: Number,
      default: 0,
    },
    totalStickerDownloadCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Counter", CounterSchema);
