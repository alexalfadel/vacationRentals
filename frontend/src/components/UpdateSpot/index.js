import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadSpotThunk } from "../../store/spots";

function UpdateSpotForm() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spotDetails = useSelector((state) => state.spots);
  const spot = spotDetails[spotId];
  const [country, setCountry] = useState(spot.country);
  const [address, setAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [state, setState] = useState(spot.state);
  const [lat, setLat] = useState(spot.lat);
  const [lng, setLng] = useState(spot.lng);
  const [description, setDescription] = useState(spot.description);
  const [name, setName] = useState(spot.name);
  const [price, setPrice] = useState(spot.price);
  const [showErr, setShowErr] = useState(false);
  const [errors, setErrors] = useState({});

  // console.log(previewImageUrl)
  useEffect(() => {
    dispatch(loadSpotThunk(spotId));
  }, [dispatch]);

  useEffect((e) => {
    const error = {}

    const existingName = allSpots.find(spot => spot.name === name)

    if (!country.length) error.country = 'Country is required'
    if (!address.length) error.address = 'Address is required'
    if (!city.length) error.city = 'City is required'
    if (!state.length) error.state = 'State is required'
    if (!lat.length) error.lat = 'Latitude is required';
    if (Number(lat) > 90 || Number(lat) < -90) error.lat = 'Latitude must be in valid range';
    if (Number(lng) > 180 || Number(lng) < -180) error.lng = 'Longitude must be in valid range';
    if (!lng.length) error.lng = 'Longitude is required'
    if (description.length < 30) error.description = 'Description needs a minimum of 30 characters'
    if (!name.length) error.name = 'Name is required'

    setErrors(error)
  }, [country, address, city, state, lat, lng, description, name, price])
  if (!spot) return <h2>Loading...</h2>;

  // console.log()

  const onSubmit = async (e) => {
    e.preventDefault();

    let newForm;

        if (Object.values(errors).length) {
            setShowErr(true)
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
                price: Number(price)
            }

            const payload = {
                spotId,
                spotData
            }


        }
  }

  return (
    <>
      <h2>Update Spot</h2>
      <h3>Where's your place located?</h3>
      <p>
        Guests will only get your exact address once they booked a reservation.
      </p>
      <form>
        <div>
          {showErr && <p>{errors.country}</p>}
          <label htmlFor="country">Country</label>
          <input
            id="country"
            type="text"
            onChange={(e) => setCountry(e.target.value)}
            value={country}
          ></input>
        </div>
        <div>
          {showErr && <p>{errors.address}</p>}
          <label htmlFor="address">Street Address</label>
          <input
            id="address"
            type="text"
            onChange={(e) => setAddress(e.target.value)}
            value={address}
          ></input>
        </div>
        <div>
          <div>
            {showErr && <p>{errors.city}</p>}
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              onChange={(e) => setCity(e.target.value)}
              value={city}
            ></input>
            <span>,</span>
          </div>
          <div>
            {showErr && <p>{errors.state}</p>}
            <label htmlFor="state">State</label>
            <input
              id="state"
              type="text"
              onChange={(e) => setState(e.target.value)}
              value={state}
            ></input>
          </div>
        </div>
        <div>
          <div>
            {showErr && <p>{errors.lat}</p>}
            <label htmlFor="lat">Latitude</label>
            <input
              id="lat"
              type="text"
              onChange={(e) => setLat(e.target.value)}
              value={lat}
            ></input>
            <span>,</span>
          </div>
          <div>
            {showErr && <p>{errors.lng}</p>}
            <label htmlFor="lng">Longitude</label>
            <input
              id="lng"
              type="text"
              onChange={(e) => setLng(e.target.value)}
              value={lng}
            ></input>
          </div>
        </div>
        <div>
          <h3>Describe your place to guests</h3>
          <p>
            Mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <textarea
            id="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          ></textarea>
          {showErr && <p>{errors.description}</p>}
        </div>
        <div>
          <h3>Create a title for your spot</h3>
          <p>
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </p>
          <input
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          ></input>
          {showErr && <p>{errors.name}</p>}
        </div>
        <div>
          <h3>Set a base price for your spot</h3>
          <p>
            Competitve pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <span>$</span>
          <input
            id="price"
            type="text"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
          ></input>
          {showErr && <p>{errors.price}</p>}
        </div>
        <button>Create Spot</button>
      </form>
    </>
  );
}

export default UpdateSpotForm;
