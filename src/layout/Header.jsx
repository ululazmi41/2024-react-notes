import React, { useContext } from 'react';

// Icons
import noteIcon from '../public/note.svg';
import { MdDarkMode, MdLanguage, MdLogout, MdOutlineLightMode } from "react-icons/md";
import { loginRoute } from '../consts/routes';
import { useNavigate } from 'react-router-dom';

import DarkmodeContext from '../contexts/themecontext';
import AuthContext from '../contexts/authContext';
import LanguageContext from '../contexts/languageContext';

// Localization
import localization from '../consts/i10n';
import { putAccessToken } from '../utils/network-data';
import LoadingContext from '../contexts/loadingContext';

function Header() {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useContext(LanguageContext);
  const { isLoggedIn, toggleAuthStatus } = useContext(AuthContext);
  const { isDarkmode, toggleDarkmode } = useContext(DarkmodeContext);
  const { logout, darktheme, lighttheme } = localization[language];
  
  // Loading
  const { setLoading } = useContext(LoadingContext);

  function handeLogout() {
    setLoading(true);
    setTimeout(() => {
      putAccessToken('');
      toggleAuthStatus();
      navigate(loginRoute);
      setLoading(false);
    }, 750);
  }

  return (
    <header className="note-app__header">
      <div className="note-app__heaader__wrapper">
        <div className="note-app__header__brand-wrapper">
          <img className="note-app__header__logo" src={noteIcon} alt="gambar logo website" />
          <h1>Catatanku</h1>
        </div>
        <div className="note-app__header__brand-wrapper">
          <button className="theme-toggler" onClick={toggleDarkmode}>{isDarkmode ? <MdDarkMode /> : <MdOutlineLightMode />} {isDarkmode ? darktheme : lighttheme}</button>
          <button className="theme-toggler" onClick={toggleLanguage}><MdLanguage /> {language}</button>
          {isLoggedIn && (
            <button className="note-app__logout-button ml-1em" onClick={handeLogout}><MdLogout className="mt-2px" /> {logout}</button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header;