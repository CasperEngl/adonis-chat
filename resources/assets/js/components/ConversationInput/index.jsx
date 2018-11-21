import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Tooltip } from 'reactstrap';
import EmojiPicker from 'emoji-picker-react';
import EmojiConvertor from 'emoji-js';
import { debounce } from 'lodash';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSmileBeam, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { toggleEmojis, closeEmojis } from '../../actions/ui';

library.add(faSmileBeam);
library.add(faPaperPlane);

const EditorContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  background: white;
  padding: .5rem;
`;

const StyledEditor = styled.input`
  padding: .25rem;
  width: 100%;
  outline: none;
  border: none;
  border-radius: .2rem;
  resize: none;
`;

const SmileyButton = styled(Button)`
  padding: .5rem 1rem !important;
`;

const SendButton = styled(Button)`
  padding: .5rem 1rem !important;
  font-weight: bold !important;
`;

class ConversationInput extends Component {
  static propTypes = {
    toggleEmojis: PropTypes.func.isRequired,
    closeEmojis: PropTypes.func.isRequired,
    emojisOpen: PropTypes.bool.isRequired,
    chat: PropTypes.object.isRequired, // eslint-disable-line
  }

  constructor(props) {
    super(props);
    const { chat } = this.props;

    this.state = {
      value: '',
    };

    this.chat = chat;

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.send = this.send.bind(this);
    this.addEmoji = this.addEmoji.bind(this);
    this.typing = debounce(this.typing, 500, {
      leading: true,
      maxWait: 1250,
    });
  }

  componentDidMount() {
    this.closeEmojis();
  }

  onKeyDown(event) {
    if (event.key !== 'Enter') {
      return;
    }

    this.send();
  }

  onChange(event) {
    const { value } = event.target;

    this.typing();

    this.setState({
      value,
    });
  }

  typing() {
    this.chat.emit('typing');
  }

  send() {
    const { value } = this.state;

    if (value.length < 1) {
      return;
    }

    this.chat.emit('message', {
      content: value,
    });

    this.setState({
      value: '',
    });
  }

  addEmoji(code, data) {
    const emoji = new EmojiConvertor();
    const { value } = this.state;

    const emote = emoji.replace_colons(`:${data.name}:`);

    this.setState({
      value: value + emote,
    });
  }

  toggleEmojis() {
    const { toggleEmojis } = this.props;

    toggleEmojis();
  }

  closeEmojis() {
    const { closeEmojis } = this.props;

    closeEmojis();
  }

  render() {
    const { emojisOpen } = this.props;
    const { value } = this.state;

    return (
      <EditorContainer>
        <StyledEditor value={value} onChange={this.onChange} onKeyDown={this.onKeyDown} placeholder="Type any message ..." autoFocus />
        <SmileyButton color="link" size="sm" onClick={this.toggleEmojis} id="emoji-selector">
          <FontAwesomeIcon icon={faSmileBeam} size="lg" />
        </SmileyButton>
        <Tooltip innerClassName="emoji-tooltip" isOpen={emojisOpen} hideArrow target="emoji-selector">
          <EmojiPicker onEmojiClick={this.addEmoji} disableDiversityPicker />
        </Tooltip>
        <SendButton onClick={this.send} color="primary" size="sm">
          <span className="pr-2">Send</span>
          {' '}
          <FontAwesomeIcon icon={faPaperPlane} size="lg" />
        </SendButton>
      </EditorContainer>
    );
  }
}

const mapStateToProps = state => ({
  emojisOpen: state.ui.emojisOpen,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleEmojis,
  closeEmojis,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ConversationInput);
