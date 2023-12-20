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

function DetailPage({ getNoteById, isLoading, renderLoading, handleUpdate, homeNavigateTo, handleSubmit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState('new'); // new || update
  const [charsLeft, setCharsLeft] = useState(CHARSLENGTH);
  const [isNoteExist, setIsNoteExist] = useState(true);
  const [isDateUpdated, setIsDateUpdated] = useState(false);
  const [isContentEdited, setIsContentEdited] = useState(false);
  const [note, setNote] = useState({
    id: -1,
    title: '',
    body: '',
    createdAt: +new Date(),
    archived: false,
  });

  // Localization
  const { language } = useContext(LanguageContext);
  const { archived, submitNote, updateNote } = localization[language];

  useEffect(() => {
    const index = parseInt(id);
    const note = getNoteById(index);

    if (note === null || note === undefined) {
      if (id !== 'new') {
        setIsNoteExist(false);
      }
    } else {
      const parsedNote = {
        id: note.id,
        title: note.title,
        body: note.body,
        createdAt: note.createdAt,
        archived: note.archived,
      };
      setNote(parsedNote);
      setState('update');
      setIsDateUpdated(false);

      renderNote(parsedNote);
      renderTagArchive(note);
    }
  }, []);

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

  function onSubmit(event) {
    event.preventDefault();
    renderLoading(() => {
      if (state === 'new') {
        handleSubmit(note.title, note.body);
      } else if (state === 'update') {
        handleUpdate(note);
      }
      navigate('/');
      homeNavigateTo('notes');
    }, 750);
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
      return <p className='note-input__title__char-limit tw-text-transparent'>placeholder</p>;
    } else if (twentiesAndBelow) {
      return <p className='note-input__title__char-limit tw-text-brown'>{charsLeft}</p>
    } else if (moreThanTen) {
      return <p className='note-input__title__char-limit tw-text-grey'>{charsLeft}</p>
    } else {
      return <p className='note-input__title__char-limit tw-text-red'>{charsLeft}</p>
    }
  }

  if (!isNoteExist) {
    return <PageNotFound />
  }

  return (
    <>
      {isLoading && <Loading />}
      <Header />
      <form className='note-input' onSubmit={onSubmit}>
        {renderCharsLeft()}
        <input
          id="judul"
          type="text"
          name="judul"
          placeholder='Judul'
          value={note.title}
          className={note.archived ? 'note-input__title tw-cursor-default' : 'note-input__title'}
          onChange={onTitleChangeHandler}
          readOnly={note.archived}
          required
        />
        <div className="note-input__date-wrapper">
          <p id="tanggal" className='note-input__date'>{showFormattedDate(note.createdAt, language)}</p>
          <div className='tag'>{toTitleCase(archived)}</div>
        </div>
        <textarea
          id="isi"
          type="text"
          name="isi"
          value={note.body}
          className={note.archived ? 'note-input__body tw-cursor-default' : 'note-input__body'}
          placeholder='Catatan'
          onChange={onBodyChangeHandler}
          readOnly={note.archived}
          required
        />
        {isContentEdited && (
          state === 'new'
            ? <button type="submit">{submitNote}</button>
            : <button type="submit">{updateNote}</button>
        )}
      </form>
    </>
  );
}

DetailPage.propTypes = {
  getNoteById: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  renderLoading: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  homeNavigateTo: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
}

export default DetailPage;