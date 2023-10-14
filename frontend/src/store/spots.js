import { csrfFetch } from "./csrf"

const LOAD_ALL_SPOTS = '/spots/loadAllSpots'

const LOAD_SPOT = '/spots/loadSpot'

const loadSpots = (spots) => {
    return {
        type: LOAD_ALL_SPOTS,
        spots
    }
}

const loadSpot = (spot) => {
    return {
        type: LOAD_SPOT,
        spot
    }
}


export const loadAllSpotsThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');

    if (response.ok) {
        const allSpots = await response.json();
        dispatch(loadSpots(allSpots))
        return allSpots
    }
}

export const loadSpotThunk = (spotId) => async (dispatch) => {
    const spotResponse = await csrfFetch(`/api/spots/${spotId}`);
    const reviewsResponse = await csrfFetch(`/api/spots/${spotId}/reviews`)

    // let spot;
    if (spotResponse.ok && reviewsResponse.ok) {
        const spotData = await spotResponse.json();
        const reviewsData = await reviewsResponse.json();

        const spot = {
            ...spotData,
            ...reviewsData
        }

        dispatch(loadSpot(spot));
        return spot
    }

}

const initialState = {};

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ALL_SPOTS: {
            const newState = {};
            action.spots.Spots.forEach(spot => {
                newState[spot.id] = spot
            })
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
}

export default spotsReducer