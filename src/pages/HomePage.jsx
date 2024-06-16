import React, { useContext, useEffect, useState } from 'react';

// Third-party
import PropTypes from 'prop-types';

import Header from '../layout/Header';

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

// Localization
import localization from '../consts/i10n';
import LanguageContext from '../contexts/languageContext';
import { archiveNote, deleteNote, getActiveNotes, getArchivedNotes, unarchiveNote } from '../utils/network-data';

function Home({ showing, homeNavigateTo }) {
  const navigate = useNavigate();
  const [notes, setHomeNotes] = useState([]);
  const [archives, setHomeArchives] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Localization
  const { language } = useContext(LanguageContext);
  const { add, notes: notesLocalization, archives: archivesLocalization } = localization[language];

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

    async function initRemoteNotes() {
      await handleRemoteActives();
      await handleRemoteArchives();
      setLoading(false);
      setInitialized(true);
    }

    initRemoteNotes();

    handleSearch(keyword);
    renderNavigationButton(showing);
    // setInitialized(true);
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

  async function handleDelete(id) {
    setLoading(true);
    const { error } = await deleteNote(id);

    if (error) {
      console.error(`failed to delete note with id: ${id}`);
      return;
    }

    toast.success(`Note deleted`, {
      iconTheme: {
        primary: '#D83636',
      },
    });

    // Reset
    handleRemoteActives();
    handleRemoteArchives();

    setLoading(false);
  }

  async function handleArchive(id) {
    setLoading(true);
    const { error } = await archiveNote(id);

    if (error) {
      console.error(`failed to archive note with id: ${id}`);
      return;
    }

    toast.success('note archived', {
      iconTheme: {
        primary: '#AC611B',
      },
    });

    // Reset
    handleRemoteActives();
    handleRemoteArchives();

    setLoading(false);
  }

  async function handleUnarchive(id) {
    setLoading(true);
    const { error } = await unarchiveNote(id);

    if (error) {
      console.error(`failed to unarchive note with id: ${id}`);
      return;
    }

    toast.success('note restored', {
      iconTheme: {
        primary: '#AC611B',
      },
    });

    // Reset
    handleRemoteActives();
    handleRemoteArchives();

    setLoading(false);
  }

  async function handleRemoteActives() {
    let { error, data: notes } = await getActiveNotes();

    if (error) {
      return;
    }

    setHomeNotes(notes);
  }

  async function handleRemoteArchives() {
    let { error, data: notes } = await getArchivedNotes();

    if (error) {
      return;
    }

    setHomeArchives(notes);
  }

  function filterNotes(notes) {
    const filteredNotes = notes.filter((note) => {
      const isIncludingTitle = note.title.toLowerCase().includes(search);
      const isIncludingDate = showFormattedDate(note.createdAt, language).toLowerCase().includes(search);
      const isIncludingBody = note.body.toLowerCase().includes(search);
      if (isIncludingTitle || isIncludingDate || isIncludingBody) {
        return true;
      } else {
        return false;
      }
    });
    return filteredNotes;
  }

  function showPage(page) {
    renderNavigationButton(page);
    homeNavigateTo(page);
  }

  function handleNotes() {
    if (showing === 'notes') {
      return filterNotes(notes);
    } else if (showing === 'archives') {
      return filterNotes(archives);
    } else {
      console.warning(`Unknown showing type: ${showing}, returning empty note`);
      return [];
    }
  }
  const filteredNotes = handleNotes();

  return (
    <>
      <Header />
      <main className="note-app__body">
        <button className="notes-app__body__button-add" onClick={() => navigate("notes/new")}>{add}</button>
        <div className="note-app__body__actions">
          <div className="note-app__body__buttons">
            <button id="notes" onClick={() => showPage("notes")} className="">{notesLocalization}</button>
            <button id="archives" onClick={() => showPage("archives")} className="">{archivesLocalization}</button>
          </div>
          <Search value={search} onChange={(event) => handleSearch(event.target.value)} />
        </div>
        <div className="relative">
          {isLoading && <Loading />}
          {!initialized && <NoteList
            notes={[]}
            onDelete={() => {}}
            handleArchive={() => {}}
            handleUnarchive={() => {}}
          />}
          {initialized && (filteredNotes.length > 0
            ? <NoteList
              notes={filteredNotes}
              onDelete={handleDelete}
              handleArchive={handleArchive}
              handleUnarchive={handleUnarchive}
            />
            : <NoteEmpty />)}
        </div>
      </main>
    </>
  )
}

Home.propTypes = {
  showing: PropTypes.string.isRequired,
  homeNavigateTo: PropTypes.func.isRequired,
}

export default Home;