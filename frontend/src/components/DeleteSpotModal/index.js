import { useModal } from "../../context/Modal";
import { deleteSpotThunk, getAllSpotsCurrentUser } from "../../store/spots";
import { useDispatch } from 'react-redux'
import './DeleteSpotModal.css'


function DeleteSpotModal ({ spotId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();


    return (
        <div className='delete-spot-modal'>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <div className='delete-spot-buttons-box'>
                <button id='delete-spot' onClick={async () => {
                     await dispatch(deleteSpotThunk(spotId));
                     dispatch(getAllSpotsCurrentUser())
                     closeModal();
                }}>Yes (Delete Spot)</button>
                <button id='keep-spot' onClick={closeModal}>No (Keep Spot)</button>
            </div>
        </div>
    )
}

export default DeleteSpotModal