import React, { useContext } from 'react';

import Header from '../layout/Header';

import { Link } from 'react-router-dom';
import { homeRoute } from '../consts/routes';

// Localization
import localization from '../consts/i10n';
import LanguageContext from '../contexts/languageContext';

function PageNotFound() {
  const { language } = useContext(LanguageContext);
  const { pageNotExistGoto, homePage } = localization[language];
  
  return (
    <>
      <Header />
      <div className="page-not-found__wrapper">
        <h2 style={{
          fontSize: '4em',
          textAlign: 'center',
          marginBottom: '0.4em',
        }}>404</h2>
        <p style={{
          fontSize: '1.4em',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '0.6em',
        }}>Page not Found</p>
        <p>{pageNotExistGoto}</p>
        <Link className='page-not-found__nav' to={homeRoute}>{homePage}</Link>
      </div>
    </>
  )
}

export default PageNotFound;