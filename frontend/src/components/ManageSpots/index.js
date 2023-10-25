import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllSpotsCurrentUser } from "../../store/spots";
import { restoreUser } from "../../store/session";
import { Link } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal";
import "./ManageSpots.css";

const formatPrice = (price) => {
  let priceString = price.toString();

  if (!priceString.includes(".")) priceString += ".00";
  return priceString;
};

function ManageSpots() {
  const history = useHistory();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.session);
  const currentSpots = useSelector((state) => Object.values(state.spots));

  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  const { user } = userData;
  useEffect(() => {
    dispatch(getAllSpotsCurrentUser(user.id));
  }, [dispatch]);

  if (!user) return <h2>Loading..</h2>;

  const newSpotClick = () => {
    history.push("/spots/new");
  };

  const deleteSpotClick = (spotId) => {
    //open modal to delete
  };

  const loadEachSpotTile = currentSpots?.map(
    ({ id, city, state, price, avgRating, previewImage, description }) => {
      
      return (
        // <Link id={`spot${id}`} to={`/spots/${id}`}>
        <div className="spots-square" id={id}>
          <Link className="spot-tile-link" id={`spot${id}`} to={`/spots/${id}`}>
            <img
              className="spot-image"
              src={previewImage}
              alt={description}
            ></img>
            <div className="spot-location-reviews">
              <p>
                {city},{state}
              </p>
              <p>
                <span>
                  <i className="fa-solid fa-star"></i>
                </span>
                { avgRating === 'No reviews yet' ? 'New' : avgRating}
              </p>
            </div>
            <p className="spot-price">
              <span className="price">${formatPrice(price)}</span> night
            </p>
          </Link>
          <div>
            <button
              className="manage-spots-update"
              onClick={() => {
                history.push(`/spots/${id}/edit`);
              }}
            >
              Update
            </button>
            <button className="manage-spots-update">
              <OpenModalButton
                textColor="white"
                buttonText="Delete"
                modalComponent={<DeleteSpotModal spotId={id} />}
              />
            </button>
          </div>
        </div>
        // </Link>
      );
    }
  );

  return (
    <div className="manage-spots-container">
      <div className="manage-spots-header">
        <h2>Manage Spots</h2>
        <button onClick={newSpotClick}>Create a New Spot</button>
      </div>
      <div className="manage-spot-tile-box">{loadEachSpotTile}</div>
    </div>
  );
}

export default ManageSpots;
