import React, { useContext } from 'react';

// Icons
import noteIcon from '../public/note.svg';
import { MdDarkMode, MdLogout, MdOutlineLightMode } from "react-icons/md";
import { loginRoute } from '../consts/routes';
import { useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';
import DarkmodeContext from '../contexts/themecontext';

function Header({ isLoggedIn, toggleAuthStatus }) {
  const navigate = useNavigate();
  const { isDarkmode, toggleDarkmode } = useContext(DarkmodeContext);

  function handeLogout() {
    // clear session

    toggleAuthStatus(false);
    navigate(loginRoute);
  }

  return (
    <header className="note-app__header">
      <div className="note-app__header__brand-wrapper">
        <img className="note-app__header__logo" src={noteIcon} alt="gambar logo website" />
        <h1>Catatanku</h1>
      </div>
      <div className="note-app__header__brand-wrapper">
        {isLoggedIn && (
          <button className="note-app__logout-button" onClick={handeLogout}><MdLogout className="mt-2px" /> Logout</button>
        )}
        <button className="theme-toggler" onClick={toggleDarkmode}>{isDarkmode ? <MdDarkMode /> : <MdOutlineLightMode />} {isDarkmode ? 'dark' : 'light'}</button>
      </div>
    </header>
  )
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool,
  toggleAuthStatus: PropTypes.func,
}

export default Header;