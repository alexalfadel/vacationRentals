import { useState, useEffect } from 'react'
import { createASpotThunk } from '../../store/spots'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { addImageToSpotThunk } from '../../store/spots'
import { loadAllSpotsThunk } from '../../store/spots'
import './NewSpotForm.css'

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
    const [ country, setCountry ] = useState('');
    const [ address, setAddress ] = useState('');
    const [ city, setCity ] = useState('');
    const [ state, setState ] = useState('');
    const [ lat, setLat ] = useState('');
    const [ lng, setLng ] = useState('')
    const [ description, setDescription ] = useState('')
    const [ name, setName ] = useState('')
    const [ price, setPrice ] = useState('')
    const [ previewImage, setPreviewImage ] = useState('');
    const [ image2, setImage2 ] = useState('')
    const [ image3, setImage3 ] = useState('')
    const [ image4, setImage4 ] = useState('')
    const [ image5, setImage5 ] = useState('')
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
        if (!validImage(image2)) error.image2 = 'Image URL must end in .png, .jpg, or .jpeg'
        if (!validImage(image3)) error.image3 = 'Image URL must end in .png, .jpg, or .jpeg'
        if (!validImage(image4)) error.image4 = 'Image URL must end in .png, .jpg, or .jpeg'
        if (!validImage(image5)) error.image5 = 'Image URL must end in .png, .jpg, or .jpeg'



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
                    if (image.length) {
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
        setCountry('')
        setAddress('')
        setCity('')
        setState('')
        setLat('')
        setLng('')
        setDescription('')
        setName('')
        setPrice('')
        setPreviewImage('')
        setImage2('Image URL')
        setImage3('Image URL')
        setImage4('Image URL')
        setImage5('Image URL')
        setErrors({})
        setShowErr(false)
        // setSubmit(false)
    }


    return (
        <div className='new-spot-form-box'>
            <h1 className='new-spot-header-one'>Create a New Spot</h1>
            <h2 className='new-spot-h2'>Where's your place located?</h2>
            <p className='new-spot-header-p'>Guests will only get your exact address once they booked a reservation.</p>
            <form className='new-spot-form' onSubmit={onSubmit}>
                <div className='wide-input-box'>
                    {/* {showErr && <p>{errors.country}</p>} */}
                    <label className='new-spot-input-labels' htmlFor='country'>Country <span>{showErr && <p className='new-spot-errors'>{errors.country}</p>}</span></label>
                    <input  placeholder='Country' id='country' type='text' onChange={(e) => setCountry(e.target.value)} value={country}></input>
                </div>
                <div>
                    {/* {showErr && <p>{errors.address}</p>} */}
                    <label className='new-spot-input-labels' htmlFor='address'>Street Address<span>{showErr && <p className='new-spot-errors'>{errors.address}</p>}</span></label>
                    <input placeholder='Address' id='address' type='text' onChange={(e) => setAddress(e.target.value)} value={address}></input>
                </div>
                <div className='city-state-box'>
                    <div className='city-box'>
                        {/* {showErr && <p>{errors.city}</p>} */}
                        <label className='city-label' htmlFor='city'>City<span>{showErr && <p className='new-spot-errors'>{errors.city}</p>}</span></label>
                        <input placeholder='City' id='city' type='text' onChange={(e) => setCity(e.target.value)} value={city}></input>
                        
                    </div>
                    <p className='city-comma'> ,</p>
                    <div className='state-box'> 
                        {/* {showErr && <p>{errors.state}</p>} */}
                        <label className='state-label' htmlFor='state'>State<span>{showErr && <p className='new-spot-errors'>{errors.state}</p>}</span></label>
                        <input placeholder='State' id='state' type='text' onChange={(e) => setState(e.target.value)} value={state}></input>
                    </div>
                </div>
                <div className='lat-lng-box'>
                    <div className='lat-box'>
                        {/* {showErr && <p>{errors.lat}</p>} */}
                        <label className='lat-label' htmlFor='lat'>Latitude<span>{showErr && <p className='new-spot-errors'>{errors.lat}</p>}</span></label>
                        <input placeholder='Latitude' id='lat' type='text' onChange={(e) => setLat(e.target.value)} value={lat}></input>
                    </div>
                    <p className='lat-comma'> ,</p>
                    <div className='lng-box'>
                        {/* {showErr && <p>{errors.lng}</p>} */}
                        <label className='lng-label' htmlFor='lng'>Longitude<span>{showErr && <p className='new-spot-errors'>{errors.lng}</p>}</span></label>
                        <input placeholder='Longitude' id='lng' type='text' onChange={(e) => setLng(e.target.value)} value={lng}></input>
                    </div>
                </div>
                <div className='description-box'>
                    <h2 className='new-spot-h2'>Describe your place to guests</h2>
                    <p className='prompt-p'>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <textarea placeholder='Please write at least 30 characters' id='description' onChange={(e) => setDescription(e.target.value)} value={description}></textarea>
                    {showErr && <p className='new-spot-errors'>{errors.description}</p>}
                </div>
                <div className='title-box'>
                    <h2 className='new-spot-h2'>Create a title for your spot</h2>
                    <p className='prompt-p'>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    <input placeholder='Name of your spot' id='name' type='text' onChange={(e) => setName(e.target.value)} value={name}></input>
                    {showErr && <p className='new-spot-errors'>{errors.name}</p>}
                </div>
                <div className='price-box'> 
                    <h2 className='new-spot-h2'>Set a base price for your spot</h2>
                    <p className='prompt-p'>Competitve pricing can help your listing stand out and rank higher in search results.</p>
                    <div className='price-input-box'>
                        <span className='dollar-sign'> $ </span><input placeholder='Price per night (USD)' id='price' type='number' onChange={(e) => setPrice(e.target.value)} value={price}></input>
                    </div>
                    {showErr && <p className='new-spot-errors'>{errors.price}</p>}
                </div>
                <div className='images-box'>
                    <h2 className='new-spot-h2'>Liven up your spot with photos</h2>
                    <p className='prompt-p'>Submit a link to at least one photo to publish your spot.</p>
                    <div className='all-image-inputs'>
                    <input  placeholder='Preview Image URL' className='image-input' id='previewImage' type='text' onChange={(e) => setPreviewImage(e.target.value)} value={previewImage}></input>
                    {showErr && <p className='new-spot-errors'>{errors.prevImage}</p>}
                    <input  placeholder='Image Url' className='image-input' id='image2' type='text' onChange={(e) => setImage2(e.target.value)} value={image2}></input>
                    {showErr && <p className='new-spot-errors'>{errors.image2}</p>}
                    <input placeholder='Image Url' className='image-input' id='image3' type='text' onChange={(e) => setImage3(e.target.value)} value={image3}></input>
                    {showErr && <p className='new-spot-errors'>{errors.image3}</p>}
                    <input placeholder='Image Url' className='image-input' id='image4' type='text' onChange={(e) => setImage4(e.target.value)} value={image4}></input>
                    {showErr && <p className='new-spot-errors'>{errors.image4}</p>}
                    <input placeholder='Image Url' className='image-input' id='image5' type='text' onChange={(e) => setImage5(e.target.value)} value={image5}></input>
                    {showErr && <p className='new-spot-errors'>{errors.image5}</p>}
                    </div>
                </div>
                <button className='new-spot-button'>Create Spot</button>
            </form>
        </div>
    )
}

export default NewSpotForm