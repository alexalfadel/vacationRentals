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

  const createSpotLink = <li><NavLink to='/spots/new'>Create a New Spot</NavLink></li>

  return (
    <ul className='header'>
      <li>
        <NavLink className='header-name' exact to="/">
          <p className='logo-link'><i className="fa-regular fa-heart" style={{color: '#e54363'}}></i> vacations</p>
        </NavLink>
      </li>
      {loggedIn && createSpotLink}
      {isLoaded && (
        <li className='profile-button'>
          <span><i class="fa-solid fa-bars"></i></span><ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}
export default Navigation;