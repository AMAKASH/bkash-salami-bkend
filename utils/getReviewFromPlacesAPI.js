const axios = require("axios");
const pLimit = require("p-limit").default;

const API_KEY = process.env.GOOGLE_PLACES_KEY;

async function getPlaceSummary(placeId) {
  try {
    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id: placeId,
          fields: "name,rating,user_ratings_total",
          key: API_KEY,
        },
      }
    );

    // Check if API returned an error
    if (res.data.status !== "OK" && res.data.status !== "ZERO_RESULTS") {
      console.error(
        `Error fetching place ${placeId}: ${res.data.status} - ${res.data.error_message || "Unknown error"}`
      );
      return {
        placeId,
        name: null,
        rating: 0,
        totalReviews: 0,
      };
    }

    const p = res.data.result;

    // Check if result exists
    if (!p) {
      console.warn(`No result found for place ${placeId}`);
      return {
        placeId,
        name: null,
        rating: 0,
        totalReviews: 0,
      };
    }

    return {
      placeId,
      name: p.name || null,
      rating: p.rating ?? 0,
      totalReviews: p.user_ratings_total ?? 0,
    };
  } catch (error) {
    console.error(`Error fetching place ${placeId}:`, error.message);
    return {
      placeId,
      name: null,
      rating: 0,
      totalReviews: 0,
    };
  }
}

const limit = pLimit(5); // max 5 at a time

const getMultiplePlacesSummary = async (placeIds) => {
  return Promise.all(placeIds.map((id) => limit(() => getPlaceSummary(id))));
};

module.exports = {
  getMultiplePlacesSummary,
};
