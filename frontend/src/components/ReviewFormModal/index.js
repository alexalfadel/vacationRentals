import { useModal } from "../../context/Modal";
import OpenModalButton from "../OpenModalButton";
import { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'

const ReviewFormModal = () => {
    const dispatch = useDispatch();
    // const [ showForm, setShowForm ] = useState(false)
    const [ reviewText, setReviewText ] = useState('Leave your review here...')
    const [ stars, setStars ] = useState('')
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
    const [ errors, setErrors ] = useState({})
    const [ showErrors, setShowErrors ] = useState(false)
    const { closeModal } = useModal();
   
    useEffect(() => {
        const error = {}
        if (reviewText.length < 10 || reviewText === 'Leave your review here...') error.review = 'Review must be at least 10 characters long'
        setErrors(error)
    }, [reviewText])


    const calculateStars = (star) => {
        const allStars = [star1, star2, star3, star4, star5]
        if (!star) {

        }
    }

    const star1Click = () => {
        console.log('star 1 clicked')
        if (!star1) {
            setStar1(true)
            setStar1Class("fa-solid fa-star");
        } else if (star1 && star2 || star3 || star4 || star5) {
            setStar2(false)
            setStar2Class('fa-regular fa-star')
            setStar3(false)
            setStar3Class('fa-regular fa-star')
            setStar4(false)
            setStar4Class('fa-regular fa-star')
            setStar5(false)
            setStar5Class('fa-regular fa-star')
        } 
    }

    const star2Click = () => {
        if (!star1 && !star2) {
            setStar1(true)
            setStar2(true)
            setStar1Class("fa-solid fa-star");
            setStar2Class("fa-solid fa-star");
        } else if (!star2) {
            setStar2(true)
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
    }

    const star1Hover = () => {
        setStar1Class('fa-solid fa-star')
    }

    const star1Leave = () => {
        setStar1Class('fa-regular fa-star')
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
        // if (!star1) setStar2Class('fa-regular fa-star')
        if (!star1) setStar1Class('fa-regular fa-star')

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
    }

    
    return (
        <>
            <form>
                <h2>How was your stay?</h2>
                {showErrors && <p>{errors.review}</p>}
                <textarea id='reviewText' onChange={(e) => setReviewText(e.target.value)} value={reviewText}></textarea>
                <div>
                    <p><span><i className={star1Class} onClick={star1Click} onMouseEnter={star1Hover} onMouseLeave={star1Leave}></i></span>
                    <span><i className={star2Class} onClick={star2Click} onMouseEnter={star2Hover} onMouseLeave={star2Leave}></i></span>
                    <span><i className={star3Class} onClick={star3Click} onMouseEnter={star3Hover} onMouseLeave={star3Leave}></i></span>
                    <span><i className={star4Class} onClick={star4Click} onMouseEnter={star4Hover} onMouseLeave={star4Leave}></i></span>
                    <span><i className={star5Class} onClick={star5Click} onMouseEnter={star5Hover} onMouseLeave={star5Leave}></i></span> Stars</p>
                </div>
                <button>Submit your review</button>
            </form>

        </>
    )
}

export default ReviewFormModal



 // const ulRef = useRef();

    // const openForm = () => {
    //     if (showForm) return;
    //     setShowMenu(true)
    // }

    // useEffect(() => {
    //     if (!showForm) return;

    //     const closeForm = (e) => {
    //         if (!ulRef.current.contains(e.target)) {
    //             setShowForm(false)
    //         }
    //     }

    //     document.addEventListener('click', closeForm)

    //     return () => document.removeEventListener('click', closeForm)
    // }, [showForm])

    // const closeForm = () => setShowForm(false)