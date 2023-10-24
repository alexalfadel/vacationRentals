import { useModal } from "../../context/Modal";
import { useState, useRef, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, Redirect } from 'react-router-dom'
import { addReviewBySpotIdThunk, loadSpotThunk } from "../../store/spots";
import './ReviewFormModal.css'

const ReviewFormModal = ({ spotId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const history = useHistory();
    const [, updateState] = useState();
    const [ reviewText, setReviewText ] = useState('')
    const [ stars, setStars ] = useState()
    const [ star1, setStar1 ] = useState(false);
    const [ star1Class, setStar1Class ] = useState('fa-regular fa-star');
    const [ star2Class, setStar2Class ] = useState('fa-regular fa-star');
    const [ star3Class, setStar3Class ] = useState('fa-regular fa-star');
    const [ star4Class, setStar4Class ] = useState('fa-regular fa-star');
    const [ star5Class, setStar5Class ] = useState('fa-regular fa-star');
    const [ star2, setStar2 ] = useState(false);
    const [ star3, setStar3 ] = useState(false);
    const [ star4, setStar4 ] = useState(false);
    const [ star5, setStar5 ] = useState(false);
    const [ submit, setSubmit ] = useState(false)
    const [ disabledClass, setDisabledClass ] = useState('true') 
    const [ errors, setErrors ] = useState({})
    const [ showErrors, setShowErrors ] = useState(false)
    
   
    useEffect(() => {
        const error = {}
        if (reviewText.length < 10 || reviewText === 'Leave your review here...') error.review = 'Review must be at least 10 characters long'
        if (reviewText.length > 256) error.reviewMax = 'Review must be under 256 characters'
        setErrors(error)

    }, [reviewText])

    useEffect(() => {
        if (errors.review || !stars) {
            setSubmit(false);
            setDisabledClass('true')
        }
        else {
            setSubmit(true)
            setDisabledClass('false')
        }
    }, [stars, errors])

    const onSubmit = async(e) => {
        e.preventDefault();

        // if (Object.value(errors.length)) {
        //     setShowErrors(true)
        // }

        const review = {
            review: reviewText,
            stars
        }

        const payload = {
            review,
            spotId
        }

        const newReview = await dispatch(addReviewBySpotIdThunk(payload)).catch(async (errors) => await errors.json())



        if (newReview.id) {
            
            closeModal();
            history.push(`/spots/${spotId}`);
            dispatch(loadSpotThunk(spotId))
        } else if (newReview.errors) {
      
            setShowErrors(true)
   
        }
        
    }

    const reset = () => {
        setReviewText('')
        setStars();
        setErrors({});
        setShowErrors(false)
        setStar1(false);
        setStar2(false);
        setStar3(false);
        setStar4(false);
        setStar5(false);
        setStar1Class('fa-regular fa-star')
        setStar2Class('fa-regular fa-star')
        setStar3Class('fa-regular fa-star')
        setStar4Class('fa-regular fa-star')
        setStar5Class('fa-regular fa-star')
        setDisabledClass('true')
        
    
    }

    const calculateStars = (star) => {
        const allStars = [star1, star2, star3, star4, star5]
        if (!star) {

        }
    }

    const star1Click = () => {
        
        if (!star1) {
            setStar1(true)
            setStar1Class("fa-solid fa-star");
        } 
        else if (star1 && (star2 || star3 || star4 || star5)) {
            setStar2(false)
            setStar2Class('fa-regular fa-star')
            setStar3(false)
            setStar3Class('fa-regular fa-star')
            setStar4(false)
            setStar4Class('fa-regular fa-star')
            setStar5(false)
            setStar5Class('fa-regular fa-star')
        } else if (star1 && !star2) {
            return
        }

        setStars(1)
    }

    const star2Click = () => {
      
        if (!star1 && !star2) {
            setStar1(true)
            setStar2(true)
            setStar1Class("fa-solid fa-star");
            setStar2Class("fa-solid fa-star");
        } else if (star2 && !star3) {
            return
        } else if (star2 && star3) {
            setStar3(false);
            setStar3Class('fa-regular fa-star')
            setStar4(false);
            setStar4Class('fa-regular fa-star')
            setStar5(false);
            setStar5Class('fa-regular fa-star')
        } 
        setStars(2)
    }

    const star1Hover = () => {
        setStar1Class('fa-solid fa-star')

    }

    const star1Leave = () => {

        if (star1 ) {
            setStar1Class('fa-solid fa-star')

        }
        else if (!star1) setStar1Class('fa-regular fa-star')
    }

    const star2Hover = () => {
        setStar1Class('fa-solid fa-star')
        setStar2Class('fa-solid fa-star')
    }

    const star2Leave = () => {
        if (!star2) setStar2Class('fa-regular fa-star')
        if (!star1) setStar1Class('fa-regular fa-star')
    }

    const star3Hover = () => {
        setStar1Class('fa-solid fa-star')
        setStar2Class('fa-solid fa-star')
        setStar3Class('fa-solid fa-star')
    }

    const star3Leave = () => {
        if (!star3) {
            setStar3Class('fa-regular fa-star')
        } 

        if (!star2) setStar2Class('fa-regular fa-star')
        if (!star1) setStar1Class('fa-regular fa-star')
        // if (!star1) setStar1Class('fa-regular fa-star')

    }

    const star4Hover = () => {
        setStar1Class('fa-solid fa-star')
        setStar2Class('fa-solid fa-star')
        setStar3Class('fa-solid fa-star')
        setStar4Class('fa-solid fa-star')
    }

    const star4Leave = () => {
        if (!star4) setStar4Class('fa-regular fa-star')
        if (!star3) setStar3Class('fa-regular fa-star')
        if (!star2) setStar2Class('fa-regular fa-star')
        if (!star1) setStar1Class('fa-regular fa-star')
    }

    const star5Hover = () => {
        setStar1Class('fa-solid fa-star')
        setStar2Class('fa-solid fa-star')
        setStar3Class('fa-solid fa-star')
        setStar4Class('fa-solid fa-star')
        setStar5Class('fa-solid fa-star')
    }

    const star5Leave = () => {
        if (!star5) setStar5Class('fa-regular fa-star')
        if (!star4) setStar4Class('fa-regular fa-star')
        if (!star3) setStar3Class('fa-regular fa-star')
        if (!star2) setStar2Class('fa-regular fa-star')
        if (!star1) setStar1Class('fa-regular fa-star')
    }

    const star3Click = () => {
        if (!star3) {
            setStar1(true)
            setStar2(true)
            setStar3(true)
            setStar1Class("fa-solid fa-star");
            setStar2Class("fa-solid fa-star");
            setStar3Class('fa-solid fa-star')
        } else if (star3 && star4) {
            setStar4(false);
            setStar4Class('fa-regular fa-star')
            setStar5(false);
            setStar5Class('fa-regular fa-star')
        } else {
            return

        }
        setStars(3)
    }

    const star4Click = () => {
        if (!star4 && !star5) {
            setStar1(true)
            setStar2(true)
            setStar3(true)
            setStar4(true)
            setStar1Class("fa-solid fa-star");
            setStar2Class("fa-solid fa-star");
            setStar3Class('fa-solid fa-star')
            setStar4Class('fa-solid fa-star')
        } else if (star4 && star5) {
            setStar5(false)
            setStar5Class('fa-regular fa-star')
        } else if (star4 && !star5) {
            return
        }

        setStars(4)
    }

    const star5Click = () => {
        if (star5) {
            return
        } else if (!star5) {
            setStar1(true)
            setStar2(true)
            setStar3(true)
            setStar4(true)
            setStar5(true)
            setStar1Class("fa-solid fa-star");
            setStar2Class("fa-solid fa-star");
            setStar3Class('fa-solid fa-star')
            setStar4Class('fa-solid fa-star')
            setStar5Class('fa-solid fa-star')
        } 

        setStars(5)
    }

    
    return (
        <div className='review-form-modal'>
            <form onSubmit={onSubmit}>
                <h2 className='review-form-h2'>How was your stay?</h2>
                {showErrors && <p>{errors.reviewMax}</p>}
                <textarea placeholder='Leave your review here...' id='reviewText' onChange={(e) => setReviewText(e.target.value)} value={reviewText}></textarea>
                <div className='star-box'>
                    <p><span><i className={star1Class} onClick={star1Click} onMouseEnter={star1Hover} onMouseLeave={star1Leave}></i></span>
                    <span><i className={star2Class} onClick={star2Click} onMouseEnter={star2Hover} onMouseLeave={star2Leave}></i></span>
                    <span><i className={star3Class} onClick={star3Click} onMouseEnter={star3Hover} onMouseLeave={star3Leave}></i></span>
                    <span><i className={star4Class} onClick={star4Click} onMouseEnter={star4Hover} onMouseLeave={star4Leave}></i></span>
                    <span><i className={star5Class} onClick={star5Click} onMouseEnter={star5Hover} onMouseLeave={star5Leave}></i></span> Stars</p>
                </div>
                <button className={disabledClass} disabled={submit ? false : true} >Submit Your Review</button>
            </form>

        </div>
    )
}

export default ReviewFormModal



 