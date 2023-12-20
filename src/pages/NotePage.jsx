import React, { useContext, useEffect, useState } from 'react';

// Third-party
import PropTypes from 'prop-types';

// layout
import Header from '../layout/header';

// Components
import Loading from '../components/Loading';

// Router
import { useNavigate, useParams } from 'react-router-dom';

// Utils
import { showFormattedDate } from '../utils';
import PageNotFound from './PageNotFound';

// Localization
import localization from '../consts/i10n';
import LanguageContext from '../contexts/languageContext';

// Consts
const CHARSLENGTH = 50;

// Helpers
import { toTitleCase } from '../helpers/helpers';
import toast from 'react-hot-toast';
import { addNote, deleteNote, getNote } from '../utils/network-data';
import LoadingContext from '../contexts/loadingContext';

function DetailPage({ isLoading, homeNavigateTo }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState('new'); // new || update
  const [charsLeft, setCharsLeft] = useState(CHARSLENGTH);
  const [isNoteExist, setIsNoteExist] = useState(true);
  const [isDateUpdated, setIsDateUpdated] = useState(false);
  const [isContentEdited, setIsContentEdited] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [note, setNote] = useState({
    id: -1,
    title: '',
    body: '',
    createdAt: +new Date(),
    archived: false,
  });

  // Localization
  const { language } = useContext(LanguageContext);
  const { archived, submitNote, updateNote: updateNoteLocalization } = localization[language];

  // Loading
  const { setLoading } = useContext(LoadingContext);

  useEffect(() => {
    handleNote();
  }, []);

  async function handleNote() {
    if (id === 'new') {
      setInitialized(true);
      return;
    }

    const { error, data: note } = await getNote(id);

    if (error) {
      console.error(`Error when trying to get note with id of ${id}`);
      setIsNoteExist(false);
      setInitialized(true);
      return;
    }

    if (note === null || note === undefined) {
      setIsNoteExist(false);
    } else {
      setNote(note);
      setState('update');
      setIsDateUpdated(false);

      renderNote(note);
      renderTagArchive(note);
    }

    setInitialized(true);
  }

  function renderNote(note) {
    const {
      title,
      body,
      createdAt,
    } = note;

    const titleElement = document.querySelector('#judul');
    titleElement.value = title;

    const bodyElement = document.querySelector('#isi');
    bodyElement.value = body;

    const createdAtElement = document.querySelector('#tanggal');
    createdAtElement.value = showFormattedDate(createdAt);
  }

  function renderTagArchive(note) {
    const tagElement = document.querySelector('.tag');

    if (note.archived) {
      tagElement.style.display = 'grid';
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);

    if (state === 'new') {
      const { error, data } = await addNote({ title: note.title, body: note.body });
      if (error || !data) return;
      toast.success(`New note added`);
    } else if (state === 'update') {
      const { error: errorDelete } = await deleteNote(note.id);
      
      if (errorDelete) {
        console.error(`Error when deleting existing note with id: ${note.id}`);
      }

      const { error: errorAdd, data } = await addNote({ title: note.title, body: note.body });
      
      if (errorAdd || !data) {
          console.error(`Error when adding note with title: ${note.title}`);
      }
      
      toast.success(`Note updated`, {
        iconTheme: {
          primary: '#5F8BCC',
        },
      });
    }
    navigate('/');
    homeNavigateTo('notes');

    setLoading(false);
  }

  function updateDate() {
    setIsDateUpdated(true);
    setNote((prevNote) => {
      return {
        ...prevNote,
        createdAt: +new Date(),
      }
    })
  }

  function onTitleChangeHandler(event) {
    if (!isDateUpdated) {
      updateDate();
    }

    if (event.target.value.length > CHARSLENGTH) {
      setCharsLeft(0);
      return;
    }

    setNote((prevNote) => {
      return {
        ...prevNote,
        title: event.target.value,
      }
    })
    setCharsLeft(CHARSLENGTH - event.target.value.length);
    setIsContentEdited(true);
  }

  function onBodyChangeHandler(event) {
    if (!isDateUpdated) {
      updateDate();
    }

    setIsContentEdited(true);
    setNote((prevNote) => {
      return {
        ...prevNote,
        body: event.target.value,
      }
    })

    // reset textarea height
    const textarea = document.querySelector("#isi");
    const noteInput = document.querySelector(".note-input");
    const wrapper = document.createElement('div');
    wrapper.style.maxWidth = noteInput.style.maxWidth;

    const copyTextarea = document.createElement('textarea');
    const defaultHeight = 150; // 150px
    copyTextarea.style.width = textarea.style.width;

    // Salin teks ke textarea rekayasa
    copyTextarea.value = textarea.value;

    wrapper.appendChild(copyTextarea);
    document.querySelector('body').appendChild(wrapper);

    // ambil tingginya
    const height = copyTextarea.scrollHeight - defaultHeight + 150;

    // Set ulang tinggi di textarea catatan
    textarea.style.height = `${height}px`;

    wrapper.removeChild(copyTextarea);
    document.querySelector('body').removeChild(wrapper);
  }

  function renderCharsLeft() {
    const stillEmpty = charsLeft === CHARSLENGTH;
    const twentiesAndBelow = charsLeft <= 20 && charsLeft > 0;
    const moreThanTen = charsLeft > 0;

    if (stillEmpty) {
      return <p className='note-input__title__char-limit tw-text-transparent'>&nbsp;</p>;
    } else if (twentiesAndBelow) {
      return <p className='note-input__title__char-limit tw-text-brown'>{charsLeft}</p>
    } else if (moreThanTen) {
      return <p className='note-input__title__char-limit tw-text-grey'>{charsLeft}</p>
    } else {
      return <p className='note-input__title__char-limit tw-text-red'>{charsLeft}</p>
    }
  }

  if (!isNoteExist && initialized) {
    return <PageNotFound />
  }

  return (
    <div className={initialized ? "" : "display-none"}>
      {isLoading && <Loading />}
      <Header />
      <form className="note-input" onSubmit={onSubmit}>
        {renderCharsLeft()}
        <input
          id="judul"
          type="text"
          name="judul"
          placeholder="Judul"
          value={note.title}
          className={note.archived ? "note-input__title tw-cursor-default" : "note-input__title"}
          onChange={onTitleChangeHandler}
          readOnly={note.archived}
          required
        />
        <div className="note-input__date-wrapper">
          <p id="tanggal" className="note-input__date">{showFormattedDate(note.createdAt, language)}</p>
          <div className="tag">{toTitleCase(archived)}</div>
        </div>
        <textarea
          id="isi"
          type="text"
          name="isi"
          value={note.body}
          className={note.archived ? "note-input__body tw-cursor-default" : "note-input__body"}
          placeholder="Catatan"
          onChange={onBodyChangeHandler}
          readOnly={note.archived}
          required
        />
        {isContentEdited && (
          state === "new"
            ? <button type="submit">{submitNote}</button>
            : <button type="submit">{updateNoteLocalization}</button>
        )}
      </form>
    </div>
  );
}

DetailPage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  homeNavigateTo: PropTypes.func.isRequired,
}

export default DetailPage;