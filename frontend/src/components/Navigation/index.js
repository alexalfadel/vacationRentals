import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
// import OpenModalButton from "../OpenModalButton";
// import LoginFormModal from "../LoginFormModal";
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import * as sessionActions from '../../store/session';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const loggedIn = !sessionUser ? false : true

  const createSpotLink = <li className='create-spot-link'><NavLink className='create-spot-link' to='/spots/new'>Create a New Spot</NavLink></li>

  return (
    <ul className='header'>
      
      <li>
        <NavLink className='header-name' exact to="/">
          <p className='logo-link'><i className="fa-regular fa-heart" style={{color: '#e54363'}}></i> vacations</p>
        </NavLink>
      </li>
      <div className='header-right'>
        {loggedIn && createSpotLink}
        {isLoaded && (
          <li className='profile-button'>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </div>
      
    </ul>
  );
}
export default Navigation;