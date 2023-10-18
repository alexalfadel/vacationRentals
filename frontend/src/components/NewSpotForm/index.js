import { useState, useEffect } from 'react'
import { createASpotThunk } from '../../store/spots'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { addImageToSpotThunk } from '../../store/spots'
import { loadAllSpotsThunk } from '../../store/spots'

// const invalidPrice = (str) => {
//     if (isNaN(Number(str))) return true
//     else if (str.length === 0) return true
//     else return false
// }

const getRandomNumber = () => {
    const newNum =  Math.floor(Math.random() * 10000000);
    return newNum
}



const validImage = (str) => {
    const splitImage = str.split('.');
    const validEndings = ['jpg', 'png', 'jpeg']
    if (validEndings.includes(splitImage[splitImage.length - 1])) return true;
    else return false;
}

// const imageName = (str, spotId) => {
//     const splitImage = str.split('.');
//     return `${spotId}-image-${getRandomNumber()}.${splitImage[splitImage.length - 1]}`
// }

function NewSpotForm() {
    const dispatch = useDispatch();
    const history = useHistory();
    const allSpots = useSelector((state) => Object.values(state.spots))
    const [ country, setCountry ] = useState('Country');
    const [ address, setAddress ] = useState('Address');
    const [ city, setCity ] = useState('City');
    const [ state, setState ] = useState('State');
    const [ lat, setLat ] = useState('Latitude');
    const [ lng, setLng ] = useState('Longitude')
    const [ description, setDescription ] = useState('Please write at least 30 characters.')
    const [ name, setName ] = useState('Name of your spot')
    const [ price, setPrice ] = useState('Price per night (USD)')
    const [ previewImage, setPreviewImage ] = useState('Preview Image URL');
    const [ image2, setImage2 ] = useState('Image URL')
    const [ image3, setImage3 ] = useState('Image URL')
    const [ image4, setImage4 ] = useState('Image URL')
    const [ image5, setImage5 ] = useState('Image URL')
    const [ errors, setErrors ] = useState({});
    // const [ submit, setSubmit ] = useState(false);
    const [ showErr, setShowErr ] = useState(false);

    // console.log(validPrice('Price per night (USD)'))

    useEffect(() => {
        dispatch(loadAllSpotsThunk)
    }, [dispatch])

    useEffect(() => {
        const error = {}

        const existingName = allSpots.find(spot => spot.name === name)

        if (!country.length || country === 'Country') error.country = 'Country is required'
        if (!address.length || address === 'Address') error.address = 'Address is required'
        if (!city.length || city === 'City') error.city = 'City is required'
        if (!state.length || state === 'State') error.state = 'State is required'
        if (!lat.length || lat === 'Latitude') error.lat = 'Latitude is required';
        if (Number(lat) > 90 || Number(lat) < -90) error.lat = 'Latitude must be in valid range';
        if (Number(lng) > 180 || Number(lng) < -180) error.lng = 'Longitude must be in valid range';
        if (!lng.length || lng === 'Longitude') error.lng = 'Longitude is required'
        if (description.length < 30 || description === 'Please write at least 30 characters') error.description = 'Description needs a minimum of 30 characters'
        if (!name.length || name === 'Name of your spot') error.name = 'Name is required'
        if (existingName) error.name = 'Spot name is already taken'
        if (price < 1 || price > 30000) error.price = 'Price is required';
        if (!previewImage.length || previewImage === 'Preview Image URL') error.prevImage = 'Preview image is required'
        // if (!validImage(previewImage)) error.prevImage = ('Image URL must end in .png, .jpg, or .jpeg')
        if (!validImage(image2) && image2 !== 'Image URL') error.image2 = 'Image URL must end in .png, .jpg, or .jpeg'
        if (!validImage(image3) && image3 !== 'Image URL') error.image3 = 'Image URL must end in .png, .jpg, or .jpeg'
        if (!validImage(image4) && image4 !== 'Image URL') error.image4 = 'Image URL must end in .png, .jpg, or .jpeg'
        if (!validImage(image5) && image5 !== 'Image URL') error.image5 = 'Image URL must end in .png, .jpg, or .jpeg'



        // console.log(errors , '---errors')

        setErrors(error)

    }, [country, address, city, state, lat, lng, description, name, price, previewImage, image2, image3, image4, image5])

    

    const onSubmit = async (e) => {
        e.preventDefault();

        let newForm;

        if (Object.values(errors).length) {
            setShowErr(true)
        } else {
            const payload = {
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

            newForm = await dispatch(createASpotThunk(payload))

            if (newForm.id) {

                const prevImage = {
                    url: previewImage,
                    preview: true
                }

                await dispatch(addImageToSpotThunk({ 
                    spotId: newForm.id,
                    image: prevImage
                }));

                const images = [image2, image3, image4, image5];

                for (let i = 0; i < images.length; i ++) {
                    const image = images[i]
                    if (image.length && image !== 'Image URL') {
                        const imageObj = {
                            url: image,
                            preview: false
                        }


                        await dispatch(addImageToSpotThunk({
                            spotId: newForm.id,
                            image: imageObj
                        }))
                    }
                }

                // images.forEach(image => {
                //     if (image.length) {
                //         const imageObj = {
                //             url: image,
                //             previewImage: false
                //         }

                //         dispatch(addImageToSpotThunk({
                //             spotId: newForm.id,
                //             image: imageObj
                //         }))
                //     }
                // })

                // console.log('spot was created')
                await dispatch(loadAllSpotsThunk())
                history.push(`/spots/${newForm.id}`)
                reset();
            }
        }


    }

    const reset = () => {
        setCountry('Country')
        setAddress('Address')
        setCity('City')
        setState('State')
        setLat('Latitude')
        setLng('Longitude')
        setDescription('Please write at least 30 characters.')
        setName('Name of your spot')
        setPrice('Price per night (USD)')
        setPreviewImage('Preview Image URL')
        setImage2('Image URL')
        setImage3('Image URL')
        setImage4('Image URL')
        setImage5('Image URL')
        setErrors({})
        setShowErr(false)
        // setSubmit(false)
    }


    return (
        <>
            <h2>Create a New Spot</h2>
            <h3>Where's your place located?</h3>
            <p>Guests will only get your exact address once they booked a reservation.</p>
            <form onSubmit={onSubmit}>
                <div>
                    {showErr && <p>{errors.country}</p>}
                    <label htmlFor='country'>Country</label>
                    <input id='country' type='text' onChange={(e) => setCountry(e.target.value)} value={country}></input>
                </div>
                <div>
                    {showErr && <p>{errors.address}</p>}
                    <label htmlFor='address'>Street Address</label>
                    <input id='address' type='text' onChange={(e) => setAddress(e.target.value)} value={address}></input>
                </div>
                <div>
                    <div>
                        {showErr && <p>{errors.city}</p>}
                        <label htmlFor='city'>City</label>
                        <input id='city' type='text' onChange={(e) => setCity(e.target.value)} value={city}></input><span>,</span>
                    </div>
                    <div>
                        {showErr && <p>{errors.state}</p>}
                        <label htmlFor='state'>State</label>
                        <input id='state' type='text' onChange={(e) => setState(e.target.value)} value={state}></input>
                    </div>
                </div>
                <div>
                    <div>
                        {showErr && <p>{errors.lat}</p>}
                        <label htmlFor='lat'>Latitude</label>
                        <input id='lat' type='text' onChange={(e) => setLat(e.target.value)} value={lat}></input><span>,</span>
                    </div>
                    <div>
                        {showErr && <p>{errors.lng}</p>}
                        <label htmlFor='lng'>Longitude</label>
                        <input id='lng' type='text' onChange={(e) => setLng(e.target.value)} value={lng}></input>
                    </div>
                </div>
                <div>
                    <h3>Describe your place to guests</h3>
                    <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <textarea id='description' onChange={(e) => setDescription(e.target.value)} value={description}></textarea>
                    {showErr && <p>{errors.description}</p>}
                </div>
                <div>
                    <h3>Create a title for your spot</h3>
                    <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    <input id='name' type='text' onChange={(e) => setName(e.target.value)} value={name}></input>
                    {showErr && <p>{errors.name}</p>}
                </div>
                <div>
                    <h3>Set a base price for your spot</h3>
                    <p>Competitve pricing can help your listing stand out and rank higher in search results.</p>
                    <span>$</span><input id='price' type='number' onChange={(e) => setPrice(e.target.value)} value={price}></input>
                    {showErr && <p>{errors.price}</p>}
                </div>
                <div>
                    <h3>Liven up your spot with photos</h3>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <input id='previewImage' type='text' onChange={(e) => setPreviewImage(e.target.value)} value={previewImage}></input>
                    {showErr && <p>{errors.prevImage}</p>}
                    <input id='image2' type='text' onChange={(e) => setImage2(e.target.value)} value={image2}></input>
                    {showErr && <p>{errors.image2}</p>}
                    <input id='image3' type='text' onChange={(e) => setImage3(e.target.value)} value={image3}></input>
                    {showErr && <p>{errors.image3}</p>}
                    <input id='image4' type='text' onChange={(e) => setImage4(e.target.value)} value={image4}></input>
                    {showErr && <p>{errors.image4}</p>}
                    <input id='image5' type='text' onChange={(e) => setImage5(e.target.value)} value={image5}></input>
                    {showErr && <p>{errors.image5}</p>}
                </div>
                <button>Create Spot</button>
            </form>
        </>
    )
}

export default NewSpotForm