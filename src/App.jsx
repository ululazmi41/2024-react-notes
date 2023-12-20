import React, { useEffect, useState } from 'react';

// Helpers
import { getInitialData } from './utils/index';

// Components
import Loading from './components/Loading';

// Toasters
import toast, { Toaster } from 'react-hot-toast';

// Route
import { Route, Routes, useNavigate } from 'react-router-dom';
import { homeRoute, loginRoute, notesRoute } from './consts/routes';
import PageNotFound from './pages/PageNotFound';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DetailPage from './pages/DetailPage';
import RegisterPage from './pages/Registerpage';

// Contexts
import { AuthProvider } from './contexts/authContext';
import { DarkmodeProvider } from './contexts/themecontext';

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
  const [authUser, setAuthUser] = useState(1);
  const [showing, setShowing] = useState('notes');

  // Booleans
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkmode, setDarkmode] = useState(false);

  function setDataTheme(isDarkmode) {
    if (isDarkmode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  useEffect(() => {
    const localTheme = JSON.parse(localStorage.getItem('darkmode')) || false;
    document.documentElement.setAttribute('data-theme', localTheme);
    setDataTheme(localTheme);
    setDarkmode(localTheme);
  }, []);

  function toggleDarkmode() {
    setDarkmode((prevState) => {
      localStorage.setItem('darkmode', JSON.stringify(!prevState));
      setDataTheme(!prevState);
      return !prevState;
    });
  }

  function toggleAuthStatus(value = null) {
    setIsLoggedIn((prevState) => {
      if (value) {
        if (value === false) {
          setAuthUser(null);
        }
        return value;
      }

      if (!prevState === false) {
        setAuthUser(null);
      }
      return !prevState;
    })
  }

  function renderLoading(func, ms) {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      if (func) {
        func();
      }
    }, ms ? ms : 750);
  }

  function handleSubmit(title, content) {
    const newNote = {
      id: +new Date(),
      title: title,
      body: content,
      createdAt: +new Date(),
      archived: false,
    };
    setNotes((prevState) => {
      return [
        ...prevState,
        newNote,
      ];
    });

    toast.success(`New note added`);
  }

  function handleUpdate(note) {
    const copyNotes = [...notes];
    const noteIndex = copyNotes.findIndex((innerNote) => innerNote.id === note.id);
    copyNotes[noteIndex] = note;

    setNotes(copyNotes);
    toast.success(`Note updated`, {
      iconTheme: {
        primary: '#5F8BCC',
      },
    });
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
      <DarkmodeProvider value={{ isDarkmode, toggleDarkmode }}>
        <Routes>
          <Route path="/*" element={<GotoLogin />} />
          <Route path="/login" element={<LoginPage toggleAuthStatus={toggleAuthStatus} setAuthUser={setAuthUser} />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </DarkmodeProvider>
    )
  }

  return (
    <DarkmodeProvider value={{ isDarkmode, toggleDarkmode }}>
      <AuthProvider value={{ isLoggedIn, toggleAuthStatus }}>
        {isLoading && <Loading />}
        <Toaster position="top-right" />
        <Routes>
          <Route path={homeRoute} element={
            <HomePage
              notes={notes}
              showing={showing}
              setNotes={setNotes}
              onDelete={handleDelete}
              renderLoading={renderLoading}
              homeNavigateTo={homeNavigateTo}
            />} />
          <Route path={`${notesRoute}/:id`} element={
            <DetailPage
              isLoading={isLoading}
              getNoteById={getNoteById}
              handleSubmit={handleSubmit}
              handleUpdate={handleUpdate}
              renderLoading={renderLoading}
              homeNavigateTo={homeNavigateTo}
            />} />
          <Route path="/login" element={<GotoHomePage />} />
          <Route path="/register" element={<GotoHomePage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AuthProvider>
    </DarkmodeProvider>
  );
}

export default App;