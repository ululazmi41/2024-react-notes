import React from 'react';
import Header from '../layout/header';
import NoteSearch from '../components/NoteSearch';
import ActiveNotes from '../components/ActiveNotes';
import { showFormattedDate } from '../utils';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      showing: 'notes', // notes | archives | bin
      loadingTimeout: null,
    }

    // Search
    this.handleSearch = this.handleSearch.bind(this);

    // actions on note
    this.onToggleArchive = this.onToggleArchive.bind(this);

    // Navigation
    this.doTimeout = this.doTimeout.bind(this); // loading animation
    this.showNotes = this.showNotes.bind(this);
    this.showArchives = this.showArchives.bind(this);
    this.showBin = this.showBin.bind(this);
    this.handleNotesToRender = this.handleNotesToRender.bind(this);
  }

  /**
   * Search
   */
  handleSearch(event) {
    event.preventDefault();
    this.setState({
      search: event.target.value.toLowerCase(),
    });
  }

  onToggleArchive(id) {
    this.setState(() => {
      const copy = this.props.notes.slice();
      const index = copy.findIndex((note) => note.id === id);
      copy[index].archived = !copy[index].archived;
      if (copy[index].archived) {
        console.log(`Archiving note with id of ${id}`);
      } else {
        console.log(`Unarchiving note with id of ${id}`);
      }
      return {
        notes: copy,
      }
    })
  }

  /**
   * Note Pages
   */
  doTimeout() {
    if (this.state.loadingTimeout != null) {
      clearTimeout(this.state.loadingTimeout);
    }

    this.setState({
      isLoading: true,
    })

    this.setState({
      loadingTimeout: setTimeout(() => {
        this.setState({
          isLoading: false,
        });
      }, 750),
    });
  }

  showNotes() {
    const notes = document.querySelector('#notes');
    const archives = document.querySelector('#archives');
    const bin = document.querySelector('#bin');

    notes.classList.remove('notes-app__button__idle')
    notes.classList.add('notes-app__button__selected')

    archives.classList.remove('notes-app__button__selected')
    archives.classList.add('notes-app__button__idle')

    bin.classList.remove('notes-app__button__selected')
    bin.classList.add('notes-app__button__idle')

    this.doTimeout();

    this.setState({
      showing: 'notes',
    });
  }

  showArchives() {
    const notes = document.querySelector('#notes');
    const archives = document.querySelector('#archives');
    const bin = document.querySelector('#bin');

    notes.classList.remove('notes-app__button__selected')
    notes.classList.add('notes-app__button__idle')

    archives.classList.remove('notes-app__button__idle')
    archives.classList.add('notes-app__button__selected')

    bin.classList.remove('notes-app__button__selected')
    bin.classList.add('notes-app__button__idle')

    this.doTimeout();

    this.setState({
      showing: 'archives',
    });
  }

  showBin() {
    const notes = document.querySelector('#notes');
    const archives = document.querySelector('#archives');
    const bin = document.querySelector('#bin');

    notes.classList.remove('notes-app__button__selected')
    notes.classList.add('notes-app__button__idle')

    archives.classList.remove('notes-app__button__selected')
    archives.classList.add('notes-app__button__idle')

    bin.classList.remove('notes-app__button__idle')
    bin.classList.add('notes-app__button__selected')

    this.doTimeout();

    this.setState({
      showing: 'bin',
    });
  }


  /**
   * Handle Notes to Render
   */
  handleNotesToRender() {
    let notes = [];
    let archives = [];
    let bin = [];

    if (this.state.search === '') {
      notes = this.props.notes.filter((note) => note.archived === false);
      archives = this.props.notes.filter((note) => note.archived === true);
    } else {
      const tempNotes = this.props.notes.filter((note) => note.archived === false);
      notes = tempNotes.filter((note) => {
        const isIncludingTitle = note.title.toLowerCase().includes(this.state.search);
        const isIncludingDate = showFormattedDate(note.date).toLowerCase().includes(this.state.search);
        const isIncludingBody = note.body.toLowerCase().includes(this.state.search);

        if (isIncludingTitle || isIncludingDate || isIncludingBody) {
          return true;
        } else {
          return false;
        }
      })

      const tempArchives = this.props.notes.filter((note) => note.archived === true);
      archives = tempArchives.filter((note) => {
        const isIncludingTitle = note.title.toLowerCase().includes(this.state.search);
        const isIncludingDate = showFormattedDate(note.date).toLowerCase().includes(this.state.search);
        const isIncludingBody = note.body.toLowerCase().includes(this.state.search);

        if (isIncludingTitle || isIncludingDate || isIncludingBody) {
          return true;
        } else {
          return false;
        }
      })
    }

    if (this.state.showing === 'notes') {
      return notes;
    } else if (this.state.showing === 'archives') {
      return archives;
    } else if (this.state.showing === 'bin') {
      return bin;
    }
  }

  render() {
    return (
      <>
        <Header />
        <main className='note-app__body'>
          <button className="notes-app__body__button-add" onClick={() => this.props.navigateTo('note')}>Tambah</button>
          <div className='note-app__body__actions'>
            <div className="note-app__body__buttons">
              <button id="notes" onClick={this.showNotes} className="notes-app__button notes-app__button__selected">Catatan</button>
              <button id="archives" onClick={this.showArchives} className="notes-app__button notes-app__button__idle">Arsip</button>
              <button id="bin" onClick={this.showBin} className="notes-app__button notes-app__button__idle">Sampah</button>
            </div>
            <NoteSearch onChange={this.handleSearch} />
          </div>
          <ActiveNotes
            notes={this.handleNotesToRender()}
            isLoading={this.state.isLoading}
            onDelete={this.props.onDelete}
            navigateTo={this.props.navigateTo}
            onToggleArchive={this.onToggleArchive}
          />
        </main>
      </>
    )
  }
}

export default Home;