import { useModal } from "../../context/Modal";
import { useDispatch } from 'react-redux'
import { deleteReviewThunk } from "../../store/spots";


function DeleteReviewModal ({ review }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const { id, spotId } = review;


    return (
        <>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <div>
                <button onClick={async () => {
                    console.log('delete button clicked')
                    await dispatch(deleteReviewThunk({id, spotId}))
                    closeModal();
                }}>Yes (Delete Review)</button>
                <button onClick={closeModal}>No (Keep Review)</button>
            </div>
        </>
    )
}

export default DeleteReviewModal