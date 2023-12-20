import React, { useContext } from 'react';

// Icons
import noteIcon from '../public/note.svg';
import { MdDarkMode, MdLogout, MdOutlineLightMode } from "react-icons/md";
import { loginRoute } from '../consts/routes';
import { useNavigate } from 'react-router-dom';

import DarkmodeContext from '../contexts/themecontext';
import AuthContext from '../contexts/authContext';

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, toggleAuthStatus } = useContext(AuthContext);
  const { isDarkmode, toggleDarkmode } = useContext(DarkmodeContext);

  function handeLogout() {
    // clear session

    toggleAuthStatus(false);
    navigate(loginRoute);
  }

  return (
    <header className="note-app__header">
      <div className="note-app__heaader__wrapper">
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
      </div>
    </header>
  )
}

export default Header;