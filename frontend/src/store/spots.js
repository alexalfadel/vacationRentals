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

export const createASpotThunk = (payload) => async (dispatch) => {
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }
    const response = await csrfFetch('/api/spots', fetchOptions);

    if (response.ok) {
        // console.log('spot was created')
        const newSpot = await response.json();
        dispatch(loadAllSpotsThunk());
        return newSpot
    } else return false
}

export const addImageToSpotThunk = (payload) => async (dispatch) => {
    const { spotId, image } = payload;

    // console.log(spotId, '----spotId')
    // console.log(image, '----image')
    // console.log(payload, '----payload')
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(image)
    }
    const response = await csrfFetch(`/api/spots/${spotId}/images`, fetchOptions);
    
    if (response.ok) {
        // console.log('adding image')
        dispatch(loadAllSpotsThunk());
    }
}

export const addReviewBySpotIdThunk = ({ review, spotId}) => async (dispatch) => {
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
    }

    console.log('we made it to the thunk')

    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, fetchOptions)

    if (response.ok) {
        const newReview = await response.json();
        console.log(newReview, '---newReview from the thunk')
        return newReview;
    } else if (response.error) {
        const errors = await response.json();
        console.log(errors, '----the errors response from the tunk')
        return errors;
    }
}

export const getAllSpotsCurrentUser = () => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/current`)
    if (response.ok) {
        const userSpots = await response.json();
        console.log(userSpots, '-----userSpots from the thunk')
        dispatch(loadSpots(userSpots));
    }
}

export const deleteSpotThunk = (spotId) => async (dispatch) => {
    const fetchOptions = {
        method: 'DELETE'
    }

    console.log(spotId)
    const response = await csrfFetch(`/api/spots/${spotId}`, fetchOptions);
    if (response.ok) {
        const message = await response.json();
        
    }
}

export const updateSpotThunk = ({ spotId, spotData }) => async (dispatch) => {
    const fetchOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spotData)
    }

    console.log(spotId, '---this is spotId');
    console.log(spotData, '----this is spotData')

    const response = await csrfFetch(`/api/spots/${spotId}`, fetchOptions)

    if (response.ok) {
        console.log('successfully updated the spot')
        const updatedSpot = await response.json()
        dispatch(loadSpotThunk(updatedSpot.id))
        return updatedSpot;
    } else {
        const failedResponse = await response.json();
        return failedResponse
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