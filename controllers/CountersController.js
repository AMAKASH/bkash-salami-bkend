const Joi = require("joi");
const { validateRequestBody } = require("../utils/utilityFunctions.js");
const Counter = require("../models/counters.js");

const Params = {
  appendInfo: Joi.object({
    fieldName: Joi.string()
      .valid(
        "totalVisitCount",
        "uniqueVisitorCount",
        "posterPageViewCount",
        "ProfilePageViewCount",
        "GifPageViewCount",
        "StickerPageViewCount",
        "FilterPageViewCount",
        "AddYoursPageViewCount",
        "totalPosterCreateCount",
        "totalProfileCreateCount",
        "totalGifDownloadCount",
        "totalStickerDownloadCount",
      )
      .required(),
  }),
  appendVisitCount: Joi.object({
    unique: Joi.boolean().optional(),
  }),
};

// Get Dashboard Info - returns current global counter
const getDashboardInfo = async (req, res) => {
  let globalCounter = await Counter.findOne();
  if (!globalCounter) {
    globalCounter = await Counter.create({});
  }

  return res.json({
    globalCounter,
  });
};

const incrementInfoCounters = async ({ fieldName }) => {
  const inc = { [fieldName]: 1 };

  const globalCounter = await Counter.findOneAndUpdate(
    {},
    { $inc: inc },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

  return { globalCounter };
};

// Append Info - increases a single counter field by 1 on the global counter
const appendInfo = async (req, res) => {
  const validated_data = validateRequestBody(Params.appendInfo, req.body);
  const { fieldName } = validated_data;

  const { globalCounter } = await incrementInfoCounters({
    fieldName,
  });

  return res.json({
    message: `${fieldName} incremented successfully`,
    globalCounter,
  });
};

// Core visit count incrementer so other controllers can reuse atomic logic.
const incrementVisitCounters = async ({ unique = false }) => {
  const inc = { totalVisitCount: 1 };
  if (unique === true) {
    inc.uniqueVisitorCount = 1;
  }

  return Counter.findOneAndUpdate(
    {},
    { $inc: inc },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );
};

// Append Visit Count - increases visit count, optionally unique visitor count
const appendVisitCount = async (req, res) => {
  const validated_data = validateRequestBody(Params.appendVisitCount, req.body);
  const { unique } = validated_data;

  await incrementVisitCounters({ unique });

  res.sendStatus(204);
};

module.exports = {
  getDashboardInfo,
  appendInfo,
  appendVisitCount,
  incrementVisitCounters,
  incrementInfoCounters,
};
