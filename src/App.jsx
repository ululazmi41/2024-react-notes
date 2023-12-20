import React, { useEffect, useState } from 'react';

// Helpers
import { getInitialData } from './utils/index';

// Components
import Loading from './components/Loading';

// Toasters
import toast, { Toaster } from 'react-hot-toast';

// Route
import { Route, Routes, useNavigate } from 'react-router-dom';
import { homeRoute, loginRoute, notesRoute, registerRoute } from './consts/routes';
import PageNotFound from './pages/PageNotFound';

// Pages
import HomePage from './pages/HomePage';
import NotePage from './pages/NotePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/Registerpage';

// Contexts
import { AuthProvider } from './contexts/authContext';
import { DarkmodeProvider } from './contexts/themecontext';
import { LanguageProvider } from './contexts/languageContext';
import { LoadingProvider } from './contexts/loadingContext';
import { getAccessToken, getUserLogged } from './utils/network-data';

function GotoLogin() {
  const navigate = useNavigate();
  useEffect(() => navigate(loginRoute), []);

  return (<></>);
}

function GotoHomePage() {
  const navigate = useNavigate();
  useEffect(() => navigate(homeRoute), []);

  return (<></>);
}

function App() {
  const [notes, setNotes] = useState(() => getInitialData());
  const [authUser, setAuthUser] = useState(null);
  const [showing, setShowing] = useState('notes');

  // Booleans
  const [isLoading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkmode, setDarkmode] = useState(false); // TOOD: refactor
  const [language, setLanguage] = useState('en');
  const [initialized, setInitialized] = useState(false);
  const [userInitialized, setuserInitialized] = useState(false);

  useEffect(() => {
    const localTheme = JSON.parse(localStorage.getItem('darkmode')) || false;
    const localLanguage = JSON.parse(localStorage.getItem('lang')) || 'en';

    initUser();

    // Init Theme
    document.documentElement.setAttribute('data-theme', localTheme);
    setDataTheme(localTheme);
    setDarkmode(localTheme);

    // Init Language
    document.documentElement.setAttribute('lang', localLanguage);
    setDataLanguage(localLanguage);
    setLanguage(localLanguage);

    // Set initialized
    setInitialized(true);
  }, []);

  async function initUser() {
    const accessToken = getAccessToken();

    // Init user
    if (accessToken !== '') {
      const { error, data: user } = await getUserLogged();

      if (!error) {
        if (user) {
          setIsLoggedIn(true);
          setAuthUser(user);
        }
      }
    }

    setuserInitialized(true);
  }

  function setDataTheme(isDarkmode) {
    if (isDarkmode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  function setDataLanguage(language) {
    document.documentElement.setAttribute('lang', language);
  }

  function toggleDarkmode() {
    setDarkmode((prevState) => {
      localStorage.setItem('darkmode', JSON.stringify(!prevState));
      setDataTheme(!prevState);
      return !prevState;
    });
  }

  function toggleLanguage() {
    setLanguage((prevLanguage) => {
      const reverted = prevLanguage === 'en' ? 'id' : 'en';
      localStorage.setItem('lang', JSON.stringify(reverted));
      setDataLanguage(reverted);
      return reverted;
    });
  }

  function toggleAuthStatus() {
    const accessToken = getAccessToken();
    if (accessToken === '') {
      setAuthUser(null);
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }

  function renderLoading(func, ms) {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      if (func) {
        func();
      }
    }, ms ? ms : 750);
  }

  function getNoteById(id) {
    const note = notes.find((note) => note.id === id);
    return note;
  }

  function handleDelete(id) {
    const filteredNotes = notes.filter((note) => note.id !== id);

    setNotes(filteredNotes);
    toast.success(`Note deleted`, {
      iconTheme: {
        primary: '#D83636',
      },
    });
  }

  function homeNavigateTo(page) {
    setShowing(page);
  }

  if (authUser === null) {
    return (
      <div className={initialized && userInitialized ? '' : 'display-none'}>
        <DarkmodeProvider value={{ isDarkmode, toggleDarkmode }}>
          <LanguageProvider value={{ language, toggleLanguage }}>
            <LoadingProvider value={{ isLoading, setLoading }}>
              <AuthProvider value={{ isLoggedIn, toggleAuthStatus }}>
                {isLoading && <Loading />}
                <Toaster position="top-right" />
                <Routes>
                  <Route path={loginRoute} element={(
                    <LoginPage
                      isLoading={isLoading}
                      renderLoading={renderLoading}
                      toggleAuthStatus={toggleAuthStatus}
                      setAuthUser={setAuthUser} />
                  )} />
                  <Route path={registerRoute} element={(
                    <RegisterPage
                      isLoading={isLoading}
                      renderLoading={renderLoading} />
                  )} />
                  <Route path="*" element={(
                    initialized && userInitialized
                      ? <GotoLogin />
                      : <></>
                  )} />
                </Routes>
              </AuthProvider>
            </LoadingProvider>
          </LanguageProvider>
        </DarkmodeProvider>
      </div>
    )
  }

  return (
    <div className={initialized && userInitialized ? '' : 'display-none'}>
      <DarkmodeProvider value={{ isDarkmode, toggleDarkmode }}>
        <LanguageProvider value={{ language, toggleLanguage }}>
          <AuthProvider value={{ isLoggedIn, toggleAuthStatus }}>
            <LoadingProvider value={{ isLoading, setLoading }}>
              {isLoading && <Loading />}
              <Toaster position="top-right" />
              <Routes>
                <Route path={homeRoute} element={
                  <HomePage
                    showing={showing}
                    setNotes={setNotes}
                    onDelete={handleDelete}
                    homeNavigateTo={homeNavigateTo}
                  />} />
                <Route path={`${notesRoute}/:id`} element={
                  <NotePage
                    isLoading={isLoading}
                    getNoteById={getNoteById}
                    renderLoading={renderLoading}
                    homeNavigateTo={homeNavigateTo}
                  />} />
                <Route path={loginRoute} element={<GotoHomePage />} />
                <Route path={registerRoute} element={<GotoHomePage />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </LoadingProvider>
          </AuthProvider>
        </LanguageProvider>
      </DarkmodeProvider>
    </div>
  );
}

export default App;