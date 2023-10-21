import { useModal } from "../../context/Modal";
import { useDispatch } from 'react-redux'
import { deleteReviewThunk } from "../../store/spots";
import './DeleteReviewModal.css'


function DeleteReviewModal ({ review }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const { id, spotId } = review;


    return (
        <div className='delete-review-modal'>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <div className='delete-review-buttons-box'>
                <button id='delete-review' onClick={async () => {
                    console.log('delete button clicked')
                    await dispatch(deleteReviewThunk({id, spotId}))
                    closeModal();
                }}>Yes (Delete Review)</button>
                <button id='keep-review' onClick={closeModal}>No (Keep Review)</button>
            </div>
        </div>
    )
}

export default DeleteReviewModal