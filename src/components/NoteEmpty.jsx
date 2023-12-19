import React from "react";

// icons
import iconNote2 from '../public/note-2.svg';

function NoteEmpty() {
  return (
    <div className="notes-list__empty-message">
      <img src={iconNote2} alt="tidak ada catatan" />
      <p>Catatan kosong</p>
    </div>
  )
}

export default NoteEmpty;