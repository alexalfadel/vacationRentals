import { csrfFetch } from "./csrf";

const LOAD_ALL_SPOTS = "/spots/loadAllSpots";

const LOAD_SPOT = "/spots/loadSpot";

const loadSpots = (spots) => {
  return {
    type: LOAD_ALL_SPOTS,
    spots,
  };
};

const loadSpot = (spot) => {
  return {
    type: LOAD_SPOT,
    spot,
  };
};

export const loadAllSpotsThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");

  if (response.ok) {
    const allSpots = await response.json();
    dispatch(loadSpots(allSpots));
    return allSpots;
  }
};

export const loadSpotThunk = (spotId) => async (dispatch) => {
  const spotResponse = await csrfFetch(`/api/spots/${spotId}`);
  const reviewsResponse = await csrfFetch(`/api/spots/${spotId}/reviews`);

  // let spot;
  if (spotResponse.ok && reviewsResponse.ok) {
    const spotData = await spotResponse.json();
    const reviewsData = await reviewsResponse.json();

    const spot = {
      ...spotData,
      ...reviewsData,
    };

    dispatch(loadSpot(spot));
    return spot;
  }
};

export const createASpotThunk = (payload) => async (dispatch) => {
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  const response = await csrfFetch("/api/spots", fetchOptions).catch(error => error);

  if (response.ok) {
    const newSpot = await response.json();
    dispatch(loadAllSpotsThunk());
    return newSpot;
  } else {
    const errors = await response.json();
    return errors;
  };
};

export const addImageToSpotThunk = (payload) => async (dispatch) => {
  const { spotId, image } = payload;

  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(image),
  };
  const response = await csrfFetch(
    `/api/spots/${spotId}/images`,
    fetchOptions
  ).catch((error) => error);

  if (response.ok) {
    dispatch(loadAllSpotsThunk());
  } else return response;
};

export const addReviewBySpotIdThunk =
  ({ review, spotId }) =>
  async (dispatch) => {
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    };

    const response = await csrfFetch(
      `/api/spots/${spotId}/reviews`,
      fetchOptions
    );

    if (response.ok) {
      const newReview = await response.json();

      return newReview;
    } else {
      const errors = await response.json();

      return errors;
    }
  };

export const getAllSpotsCurrentUser = () => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/current`);
  if (response.ok) {
    const userSpots = await response.json();

    dispatch(loadSpots(userSpots));
  }
};

export const deleteSpotThunk = (spotId) => async (dispatch) => {
  const fetchOptions = {
    method: "DELETE",
  };

  const response = await csrfFetch(`/api/spots/${spotId}`, fetchOptions);
  if (response.ok) {
    const message = await response.json();
  }
};

export const updateSpotThunk =
  ({ spotId, spotData }) =>
  async (dispatch) => {
    const fetchOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(spotData),
    };

    const response = await csrfFetch(`/api/spots/${spotId}`, fetchOptions);

    if (response.ok) {
      const updatedSpot = await response.json();
      dispatch(loadSpotThunk(updatedSpot.id));
      return updatedSpot;
    } else {
      const failedResponse = await response.json();
      return failedResponse;
    }
  };

export const deleteReviewThunk =
  ({ id, spotId }) =>
  async (dispatch) => {
    const fetchOptions = {
      method: "DELETE",
    };
    const response = await csrfFetch(`/api/reviews/${id}`, fetchOptions);

    if (response.ok) {
      await response.json();
      dispatch(loadSpotThunk(spotId));
    }
  };

const initialState = {};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ALL_SPOTS: {
      const newState = {};
      action.spots.Spots.forEach((spot) => {
        newState[spot.id] = spot;
      });
      return newState;
    }
    case LOAD_SPOT: {
      const newState = {};
      newState[action.spot.id] = action.spot;
      return newState;
    }
    default:
      return state;
  }
};

export default spotsReducer;
