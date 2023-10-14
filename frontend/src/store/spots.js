import { csrfFetch } from "./csrf"

const LOAD_SPOTS = '/spots/getAllSpots'

const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
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

const initialState = {};

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            const newState = {};
            action.spots.Spots.forEach(spot => {
                newState[spot.id] = spot
            })
            return newState;
        }
        default:
            return state;
    }
}

export default spotsReducer