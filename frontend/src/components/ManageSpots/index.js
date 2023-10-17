import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react'
import { getAllSpotsCurrentUser } from '../../store/spots';
import { restoreUser } from '../../store/session';
import { Link } from 'react-router-dom'
import OpenModalButton from '../OpenModalButton';
import DeleteSpotModal from '../DeleteSpotModal';

function ManageSpots () {
    const history = useHistory();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.session)
    const currentSpots = useSelector((state) => Object.values(state.spots))


    useEffect(() => {
        dispatch(restoreUser())
    }, [dispatch])


    const { user } = userData;
    useEffect(() => {
        console.log('about to dispatch thunk')
        dispatch(getAllSpotsCurrentUser(user.id))
    }, [dispatch])

    if (!user) return <h2>Loading..</h2>


    const newSpotClick = () => {
        history.push('/spots/new')
    }

    const deleteSpotClick = (spotId) => {
        //open modal to delete
    }


    const loadEachSpotTile = currentSpots?.map(({ id, city, state, price, avgRating, previewImage, description}) => {
        return (
            // <Link id={`spot${id}`} to={`/spots/${id}`}>
                <div className='spots-square' id={id}>
                    <Link id={`spot${id}`} to={`/spots/${id}`}>
                    <img src={previewImage} alt={description}></img>
                    <div>
                        <p>{city},{state}</p>
                        <p><span><i className="fa-solid fa-star"></i></span>{avgRating}</p>
                    </div>
                    <p>${price} night</p>
                    </Link>
                    <div>
                        <button onClick={() => {
                            history.push(`/spots/${id}/edit`)
                        }}>Update</button>
                        <OpenModalButton buttonText='Dele' modalComponent={<DeleteSpotModal spotId={id} />} />

                    </div>
                </div>
            // </Link>
            
        )
    })

    

    return (
        <>
            <div>
                <h2>Manage Your Spots</h2>
                <button onClick={newSpotClick}>Create a New Spot</button>
            </div>
            <div>
                {loadEachSpotTile}
            </div>
            
        </>
    )
}

export default ManageSpots