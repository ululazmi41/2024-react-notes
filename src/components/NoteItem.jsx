import React from 'react';

function NoteItem({
  id,
  title,
  date,
  body,
  archived,
  onDelete,
  navigateTo,
  onToggleArchive,
}) {
  return (
    <div className="note-item">
      <div className="note-item__content" onClick={() => navigateTo(`note/${id}`)}>
        <h3 className='note-item__title'>{title}</h3>
        <p className="note-item__date">{date}</p>
        <p className="note-item__body">{body}</p>
      </div>
      <div className="note-item__action">
        <button className="note-item__delete-button" onClick={() => onDelete(id)}>Hapus</button>
        <button className="note-item__archive-button" onClick={() => onToggleArchive(id)}>
          {archived ? (
            "Pindahkan"
            ) : (
            "Arsip"
          )}
          </button>
      </div>
    </div>
  );
}

export default NoteItem;