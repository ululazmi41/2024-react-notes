import React from 'react';
import Header from '../layout/header';
import { showFormattedDate } from '../utils';
import Loading from '../components/Loading';

const CHARSLENGTH = 50

class Note extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      note: {
        id: -1,
        title: '',
        body: '',
        createdAt: +new Date(),
        archived: false,
      },
      state: 'new', // new || update
      charsLeft: CHARSLENGTH,
      isLoading: false,
      isContentEdited: false,
    }

    this.onSubmit = this.onSubmit.bind(this);

    this.renderLoading = this.renderLoading.bind(this);
    this.removeLoading = this.removeLoading.bind(this);

    this.renderNote = this.renderNote.bind(this);
    this.updateDate = this.updateDate.bind(this);

    this.handleTitle = this.handleTitle.bind(this);
    this.handleTextarea = this.handleTextarea.bind(this);
    this.renderCharsLeft = this.renderCharsLeft.bind(this);
    this.getCurrentNoteIndex = this.getCurrentNoteIndex.bind(this);

    this.renderTagArchive = this.renderTagArchive.bind(this);
  }

  componentDidMount() {
    const noteIndex = this.getCurrentNoteIndex();
    const index = parseInt(noteIndex);
    const note = this.props.getNoteById(index);

    if (note === null || note === undefined) {
      //
    } else {
      this.setState({
        note: note,
        state: 'update'
      })
      this.renderNote(note);
      this.renderTagArchive(note);
    }
  }

  renderTagArchive(note) {
    const tagElement = document.querySelector('.tag');

    if (note.archived) {
      tagElement.style.display = 'grid';
    }
  }

  renderNote(note) {
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

  getCurrentNoteIndex() {
    const url = window.location.pathname;
    const index = url.split('/')[2];
    return index;
  }

  onSubmit(event) {
    event.preventDefault();

    this.props.renderLoading(() => {
      if (this.state.state === 'new') {
        this.props.handleSubmit(this.state.note.title, this.state.note.body);
      } else if (this.state.state === 'update') {
        this.props.handleUpdate(this.state.note);
      }

      this.props.navigateTo('');
    }, 750);
  }

  updateDate() {
    const copyNote = this.state.note;
    copyNote.createdAt = +new Date();

    this.setState({
      note: copyNote,
    });

    const createdAtElement = document.querySelector('#tanggal');
    createdAtElement.value = showFormattedDate(copyNote.createdAt);
  }

  handleTitle(event) {
    const { value } = event.target;

    this.updateDate();

    if (value.length > CHARSLENGTH) {
      this.setState({
        charsLeft: 0,
      });

      event.target.value = this.state.note.title;
      return;
    }

    const note = this.state.note;
    note.title = event.target.value;

    this.setState({
      note: note,
      charsLeft: CHARSLENGTH - value.length,

      isContentEdited: true,
    })
  }

  handleTextarea(event) {
    this.updateDate();

    const note = this.state.note;
    note.body = event.target.value;

    this.setState({
      note: note,

      isContentEdited: true,
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
    const height = copyTextarea.scrollHeight - defaultHeight + 50;

    // Set ulang tinggi di textarea catatan
    textarea.style.height = `${height}px`;

    wrapper.removeChild(copyTextarea);
    document.querySelector('body').removeChild(wrapper);
  }

  renderCharsLeft() {
    const stillEmpty = this.state.charsLeft === CHARSLENGTH;
    const twentiesAndBelow = this.state.charsLeft <= 20 && this.state.charsLeft > 0;
    const moreThanTen = this.state.charsLeft > 0;

    if (stillEmpty) {
      return <p className='note-input__title__char-limit tw-text-transparent'>placeholder</p>;
    } else if (twentiesAndBelow) {
      return <p className='note-input__title__char-limit tw-text-brown'>{this.state.charsLeft}</p>
    } else if (moreThanTen) {
      return <p className='note-input__title__char-limit tw-text-grey'>{this.state.charsLeft}</p>
    } else {
      return <p className='note-input__title__char-limit tw-text-red'>{this.state.charsLeft}</p>
    }
  }

  renderLoading() {
    this.setState({
      isLoading: true,
    })
  }

  removeLoading() {
    this.setState({
      isLoading: false,
    })
  }

  render() {
    return (
      <>
        {this.state.isLoading && (
          <div>
            <Loading />
          </div>
        )}
        <Header />
        <form className='note-input' onSubmit={this.onSubmit}>
          {this.renderCharsLeft()}
          <input
            id="judul"
            type="text"
            name="judul"
            placeholder='Judul'
            className={this.state.note.archived ? 'note-input__title tw-cursor-default' : 'note-input__title'}
            onChange={this.handleTitle}
            readOnly={this.state.note.archived}
            required
          />
          <div className="note-input__date-wrapper">
            <p id="tanggal" className='note-input__date'>{showFormattedDate(this.state.note.createdAt)}</p>
            <div className='tag'>Arsip</div>
          </div>
          <textarea
            id="isi"
            type="text"
            name="isi"
            className={this.state.note.archived ? 'note-input__body tw-cursor-default' : 'note-input__body'}
            placeholder='Catatan'
            onChange={this.handleTextarea}
            readOnly={this.state.note.archived}
            required
          />
          {this.state.isContentEdited && (
            this.state.state === 'new'
              ? <button type="submit">Simpan</button>
              : <button type="submit">Perbarui</button>
          )
          }
        </form>
      </>
    );
  }
}

export default Note;