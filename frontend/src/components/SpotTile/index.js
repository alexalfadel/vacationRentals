import { Link } from 'react-router-dom';
import { useState } from 'react'
import '../AllSpots/AllSpots.css'

const formatRating = (num) => {
    const nums = [1, 2, 3, 4, 5];
    if (num) {
        if (nums.includes(num)) return `${num}.0`
        if (num.toString().length > 3) {
        return Number(num).toFixed(2)
        }
    }
    
    else return num;
}

const formatPrice = (price) => {
    console.log(typeof price)
    let priceString = price.toString();
    console.log(priceString)
    if (!priceString.includes('.')) priceString += '.00'
    return priceString
}


function SpotTile({ spot }) {

    const { id, name, city, state, price, avgRating, previewImage, description} = spot;

    const [ visible, setVisible ] = useState(false);

    console.log(previewImage)

    return (
        <Link className='link-tag-spot-tile' id={`spot${id}`} to={`/spots/${id}`}>
                    <div className='spots-square' id={id} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
                        <img className='spot-image' src={previewImage} alt={description}></img>
                        {/* <div><ToolTip name={name}/></div> */}
                        <div className='spot-location-reviews'>
                            <p>{city},{state}</p>
                            <p><span><i className="fa-solid fa-star"></i></span>{formatRating(avgRating)}</p>
                        </div>
                        <p className='spot-price'><span className='price'>${formatPrice(price)}</span> night</p>
                        <span id="tooltip" className={visible ? 'visible' : 'hidden'} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}><p>{name}</p></span>
                    </div>
                    
        </Link>
    )
}

export default SpotTile