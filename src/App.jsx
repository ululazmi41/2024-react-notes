import React, { useState } from 'react';

// Helpers
import { getInitialData } from './utils/index';

// Components
import Loading from './components/Loading';

// Pages
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';

// Toasters
import toast, { Toaster } from 'react-hot-toast';

// Route
import { Route, Routes } from 'react-router-dom';
import { homeRoute, notesRoute } from './consts/routes';
import PageNotFound from './pages/PageNotFound';

function App() {
  const [notes, setNotes] = useState(() => getInitialData());
  const [isLoading, setIsLoading] = useState(false);
  const [showing, setShowing] = useState('notes');

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

  return (
    <>
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
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default App;