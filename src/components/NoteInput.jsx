import React from 'react';

const CHARSLENGTH = 50

class NoteInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      charsLeft: CHARSLENGTH,
      title: '',
      content: '',
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.handleTitle = this.handleTitle.bind(this);
    this.handleContent = this.handleContent.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(this.state.title, this.state.content);
  }

  handleTitle(event) {
    const { value } = event.target;

    if (value.length > CHARSLENGTH) {
      event.target.value = this.state.title;
      return;
    }

    
    this.setState({
      title: value,
      charsLeft: CHARSLENGTH - value.length,
    })
  }

  handleContent(event) {
    this.setState({
      content: event.target.value,
    })
  }

  render() {
    return (
      <form className='note-input' onSubmit={this.onSubmit}>
        <h2 className='note-input__title' htmlFor="judul">Buat catatan</h2>
        <p className='note-input__title__char-limit'>Sisa karakter: {this.state.charsLeft}</p>
        <input
          type="text"
          name="judul"
          id="judul"
          placeholder='judul ...'
          onChange={this.handleTitle}
          required
        />
        <textarea
          className='note-input__body'
          type="text"
          name="judul"
          id="judul"
          placeholder='tuliskan catatan ...'
          onChange={this.handleContent}
          required
        />
        <button type="submit">Kirim</button>
      </form>
    )
  };
}

export default NoteInput;