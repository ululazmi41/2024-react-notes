import React from 'react';
import Header from '../layout/header';
import { Link } from 'react-router-dom';
import { homeRoute } from '../consts/routes';

function PageNotFound() {
  return (
    <>
      <Header />
      <div style={{
        width: 'max-content',
        alignContent: 'center',
        height: '70vh',
        display: 'grid',
        margin: 'auto',
      }}>
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
        <p>The page you are looking for doesn`t exist. Go to</p>
        <p style={{
          textAlign: 'center',
        }}><Link to={homeRoute}>Home Page</Link></p>
      </div>
    </>
  )
}

export default PageNotFound;