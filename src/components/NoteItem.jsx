import React from 'react';

// Third-party
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// Icons
import iconDelete from '../public/delete.svg';
import iconArchive from '../public/bookmark.svg';
import iconRestore from '../public/back-arrow.svg';

// Routes
import { notesRoute } from '../consts/routes';

function handleNoteItemOnKeyDown(e, id, navigate) {
  const isNoteItemSelected = document.activeElement === document.getElementById(id);
  if (e.code === "Enter" && isNoteItemSelected) {
    navigate(`${notesRoute}/${id}`);
  }
}

function NoteItem({ id, title, date, body, archived, onDelete, onToggleArchive }) {
  const navigate = useNavigate();

  return (
    <div id={id} className="note-item" tabIndex={0} onKeyDown={(e) => handleNoteItemOnKeyDown(e, id, navigate)}>
      <div className="note-item__content">
        <h3 className='note-item__title' onClick={() => navigate(`${notesRoute}/${id}`)}>{title}</h3>
        <p className="note-item__date" onClick={() => navigate(`${notesRoute}/${id}`)}>{date}</p>
        <p className="note-item__body" onClick={() => navigate(`${notesRoute}/${id}`)}>{body}</p>
      </div>
      <div className="note-item__action">
        <button className="note-item__delete-button" onClick={() => onDelete(id)}>
          <img src={iconDelete} width="22px" />
        </button>
        <button className="note-item__archive-button" onClick={() => onToggleArchive(id)}>
          {archived
            ? <img src={iconRestore} width="22px" />
            : <img src={iconArchive} width="22px" />
          }
        </button>
      </div>
    </div>
  );
}

NoteItem.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  archived: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleArchive: PropTypes.func.isRequired,
}

export default NoteItem;