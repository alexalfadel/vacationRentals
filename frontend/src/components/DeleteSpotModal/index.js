import { useModal } from "../../context/Modal";
import { deleteSpotThunk, getAllSpotsCurrentUser } from "../../store/spots";
import { useDispatch } from 'react-redux'


function DeleteSpotModal ({ spotId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();


    return (
        <>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <div>
                <button onClick={async () => {
                     await dispatch(deleteSpotThunk(spotId));
                     dispatch(getAllSpotsCurrentUser())
                     closeModal();
                }}>Yes (Delete Spot)</button>
                <button onClick={closeModal}>No (Keep Spot)</button>
            </div>
        </>
    )
}

export default DeleteSpotModal