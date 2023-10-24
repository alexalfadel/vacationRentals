import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loadSpotThunk,
  loadAllSpotsThunk,
  updateSpotThunk,
} from "../../store/spots";
import "./UpdateSpot.css";

function UpdateSpotForm() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { spotId } = useParams();
  const allSpotDetails = useSelector((state) => Object.values(state.spots));
  const spot = allSpotDetails.find(
    (currSpot) => currSpot.id === Number(spotId)
  );

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [showErr, setShowErr] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(loadAllSpotsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (spot) {
      setCountry(spot.country);
      setAddress(spot.address);
      setCity(spot.city);
      setState(spot.state);
      setLat(spot.lat);
      setLng(spot.lng);
      setDescription(spot.description);
      setName(spot.name);
      setPrice(spot.price);
    }
  }, [spot]);

  useEffect(() => {
    if (spot) {
      const error = {};

      const existingName = allSpotDetails.find((spot) => spot.name === name);
      const originalName = spot.name;

      if (!country.length) error.country = "Country is required";
      if (!address.length) error.address = "Address is required";
      if (!city.length) error.city = "City is required";
      if (!state.length) error.state = "State is required";
      if (!lat) error.lat = "Latitude is required";
      if (Number(lat) > 90 || Number(lat) < -90)
        error.lat = "Latitude must be in valid range";
      if (Number(lng) > 180 || Number(lng) < -180)
        error.lng = "Longitude must be in valid range";
      if (!lng) error.lng = "Longitude is required";
      if (description.length < 30)
        error.description = "Description needs a minimum of 30 characters";
      if (!name.length) error.name = "Name is required";
      if (existingName && name !== originalName)
        error.name = "Name is already taken";

      setErrors(error);
    }
  }, [country, address, city, state, lat, lng, description, name, price]);

  if (!allSpotDetails) return <h2>Loading...</h2>;

  const onSubmit = async (e) => {
    e.preventDefault();

    let newForm;

    if (Object.values(errors).length) {
      setShowErr(true);
    } else {
      const spotData = {
        address,
        city,
        state,
        country,
        lat: Number(lat),
        lng: Number(lng),
        name,
        description,
        price: Number(price),
      };

      const payload = {
        spotId: Number(spotId),
        spotData,
      };

      newForm = await dispatch(updateSpotThunk(payload));

      if (newForm.id) {
        history.push(`/spots/${newForm.id}`);
        // await dispatch(loadAllSpotsThunk())

        reset();
      }
    }
  };

  const reset = () => {
    setCountry(spot.country);
    setAddress(spot.address);
    setCity(spot.city);
    setState(spot.state);
    setLat(spot.lat);
    setLng(spot.lng);
    setDescription(spot.description);
    setName(spot.name);
    setPrice(spot.price);
    setShowErr(false);
    setErrors({});
  };

  return (
    <div className="update-spot-form-box">
      <h1 className="update-spot-header-one">Update Spot</h1>
      <h2 className="update-spot-h2">Where's your place located?</h2>
      <p className="update-spot-header-p">
        Guests will only get your exact address once they booked a reservation.
      </p>
      <form className="update-spot-form" onSubmit={onSubmit}>
        <div className="wide-input-box">
          {/* {showErr && <p>{errors.country}</p>} */}
          <label className="update-spot-input-labels" htmlFor="country">
            Country
            <span>
              {showErr && (
                <p className="update-spot-errors">{errors.country}</p>
              )}
            </span>
          </label>
          <input
            id="country"
            type="text"
            onChange={(e) => setCountry(e.target.value)}
            value={country}
          ></input>
        </div>
        <div>
          {/* {showErr && <p>{errors.address}</p>} */}
          <label className="update-spot-input-labels" htmlFor="address">
            Street Address
            <span>
              {showErr && (
                <p className="update-spot-errors">{errors.address}</p>
              )}
            </span>
          </label>
          <input
            id="address"
            type="text"
            onChange={(e) => setAddress(e.target.value)}
            value={address}
          ></input>
        </div>
        <div className="update-spot-city-state-box">
          <div className="update-spot-city-box">
            {/* {showErr && <p>{errors.city}</p>} */}
            <label className="update-spot-city-label" htmlFor="city">
              City
              <span>
                {showErr && <p className="update-spot-errors">{errors.city}</p>}
              </span>
            </label>
            <input
              id="city"
              type="text"
              onChange={(e) => setCity(e.target.value)}
              value={city}
            ></input>
          </div>
          <p className="city-comma"> ,</p>
          <div className="update-spot-state-box">
            {/* {showErr && <p>{errors.state}</p>} */}
            <label className="update-spot-state-label" htmlFor="state">
              State
              <span>
                {showErr && (
                  <p className="update-spot-errors">{errors.state}</p>
                )}
              </span>
            </label>
            <input
              id="state"
              type="text"
              onChange={(e) => setState(e.target.value)}
              value={state}
            ></input>
          </div>
        </div>
        <div className="update-spot-lat-lng-box">
          <div className="update-spot-lat-box">
            {/* {showErr && <p>{errors.lat}</p>} */}
            <label className="update-spot-lat-label" htmlFor="lat">
              Latitude
              <span>
                {showErr && <p className="update-spot-errors">{errors.lat}</p>}
              </span>
            </label>
            <input
              id="lat"
              type="text"
              onChange={(e) => setLat(e.target.value)}
              value={lat}
            ></input>
          </div>
          <p className="lat-comma"> ,</p>
          <div className="update-spot-lng-box">
            {/* {showErr && <p>{errors.lng}</p>} */}
            <label className="update-spot-lng-label" htmlFor="lng">
              Longitude
              <span>
                {showErr && <p className="update-spot-errors">{errors.lng}</p>}
              </span>
            </label>
            <input
              id="lng"
              type="text"
              onChange={(e) => setLng(e.target.value)}
              value={lng}
            ></input>
          </div>
        </div>
        <div className="update-spot-description-box">
          <h2 className="update-spot-h2">Describe your place to guests</h2>
          <p className="update-spot-prompt-p">
            Mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <textarea
            id="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          ></textarea>
          {showErr && (
            <p className="update-spot-errors">{errors.description}</p>
          )}
        </div>
        <div className="update-spot-title-box">
          <h2 className="update-spot-h2">Create a title for your spot</h2>
          <p className="update-spot-prompt-p">
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </p>
          <input
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          ></input>
          {showErr && <p className="update-spot-errors">{errors.name}</p>}
        </div>
        <div className="update-spot-price-box">
          <h2 className="update-spot-h2">Set a base price for your spot</h2>
          <p className="update-spot-prompt-p">
            Competitve pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <div className="update-spot-price-input-box">
            <span className="dollar-sign"> $</span>
            <input
              id="price"
              type="text"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            ></input>
          </div>
          {showErr && <p>{errors.price}</p>}
        </div>
        <button className="update-spot-button">Update your Spot</button>
      </form>
    </div>
  );
}

export default UpdateSpotForm;
