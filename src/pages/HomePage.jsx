import React, { useEffect, useState } from 'react';

// Third-party
import PropTypes from 'prop-types';

import Header from '../layout/header';

// Components
import Search from '../components/Search';
import Loading from '../components/Loading';
import NoteList from '../components/NoteList';
import NoteEmpty from '../components/NoteEmpty';

// Helpers
import { showFormattedDate } from '../utils';

// Router
import { useNavigate, useSearchParams } from 'react-router-dom';

// Toast
import toast from 'react-hot-toast';

function Home({ notes, showing, onDelete, homeNavigateTo, setNotes }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadingTimeout, setLoadingTimeout] = useState(null);

  function handleSearch(keyword) {
    if (keyword === null || keyword === undefined || keyword === '') {
      setSearch('');
      setSearchParams({});
    } else {
      setSearch(keyword.toLowerCase());
      setSearchParams({ q: keyword });
    }
  }

  useEffect(() => {
    const keyword = searchParams.get('q');
    handleSearch(keyword);
    renderNavigationButton(showing);
    setInitialized(true);
  }, []);

  function renderNavigationButton(page) {
    const notes = document.querySelector('#notes');
    const archives = document.querySelector('#archives');

    if (page === 'notes') {
      notes.className = 'notes-app__button notes-app__button__selected';
      archives.className = 'notes-app__button notes-app__button__idle';
    } else if (page === 'archives') {
      archives.className = 'notes-app__button notes-app__button__selected';
      notes.className = 'notes-app__button notes-app__button__idle';
    } else {
      console.warning(`Unknown page when rendering navigation button: ${page}`);
    }
  }

  function handleDelete(id) {
    renderLoading(400, () => {
      onDelete(id);
    });
  }

  function onToggleArchive(id) {
    renderLoading(400, () => {
      const copy = notes.slice();
      const index = copy.findIndex((note) => note.id === id);
      copy[index].archived = !copy[index].archived;
      if (copy[index].archived) {
        toast.success('note archived', {
          iconTheme: {
            primary: '#AC611B',
          },
        });
      } else {
        toast.success('note restored', {
          iconTheme: {
            primary: '#AC611B',
          },
        });
      }

      setNotes(copy);
    });
  }

  function renderLoading(ms, fun) {
    const timeout = setTimeout(() => {
      setIsLoading(false);

      if (fun) {
        fun();
      }
    }, ms);
    
    if (loadingTimeout != null) {
      clearTimeout(loadingTimeout);
    }

    setIsLoading(true);
    setLoadingTimeout(timeout)
  }

  function showPage(page) {
    renderNavigationButton(page);
    homeNavigateTo(page);
  }

  function handleNotes(notesParams) {
    let notes = [];
    let archives = [];

    if (search === '') {
      notes = notesParams.filter((note) => note.archived === false);
      archives = notesParams.filter((note) => note.archived === true);
    } else {
      const tempNotes = notesParams.filter((note) => note.archived === false);
      notes = tempNotes.filter((note) => {
        const isIncludingTitle = note.title.toLowerCase().includes(search);
        const isIncludingDate = showFormattedDate(note.createdAt).toLowerCase().includes(search);
        const isIncludingBody = note.body.toLowerCase().includes(search);

        if (isIncludingTitle || isIncludingDate || isIncludingBody) {
          return true;
        } else {
          return false;
        }
      })

      const tempArchives = notesParams.filter((note) => note.archived === true);
      archives = tempArchives.filter((note) => {
        const isIncludingTitle = note.title.toLowerCase().includes(search);
        const isIncludingDate = showFormattedDate(note.createdAt).toLowerCase().includes(search);
        const isIncludingBody = note.body.toLowerCase().includes(search);

        if (isIncludingTitle || isIncludingDate || isIncludingBody) {
          return true;
        } else {
          return false;
        }
      })
    }

    if (showing === 'notes') {
      return notes;
    } else if (showing === 'archives') {
      return archives;
    } else {
      return [];
    }
  }

  const filteredNotes = handleNotes(notes);

  return (
    <>
      <Header />
      <main className="note-app__body">
        <button className="notes-app__body__button-add" onClick={() => navigate("notes/new")}>Tambah</button>
        <div className="note-app__body__actions">
          <div className="note-app__body__buttons">
            <button id="notes" onClick={() => showPage("notes")} className="">Catatan</button>
            <button id="archives" onClick={() => showPage("archives")} className="">Arsip</button>
          </div>
          <Search value={search} onChange={(event) => handleSearch(event.target.value)} />
        </div>
        <div className="relative">
          {isLoading && <Loading />}
          {initialized && (filteredNotes.length > 0
            ? <NoteList
              notes={filteredNotes}
              onDelete={handleDelete}
              onToggleArchive={onToggleArchive}
            />
            : <NoteEmpty />)}
        </div>
      </main>
    </>
  )
}

Home.propTypes = {
  notes: PropTypes.array.isRequired,
  showing: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  homeNavigateTo: PropTypes.func.isRequired,
  setNotes: PropTypes.func.isRequired,
}

export default Home;