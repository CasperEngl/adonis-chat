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

import {
  getConversation,
  newConversation,
  sendReply,
} from '../../actions/conversation';

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
    chat: PropTypes.object.isRequired, // eslint-disable-line
  }

  constructor(props) {
    super(props);
    const { chat } = this.props;

    this.state = {
      value: '',
      showEmojis: false,
    };

    this.chat = chat;

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.send = this.send.bind(this);
    this.addEmoji = this.addEmoji.bind(this);
    this.toggleEmojis = this.toggleEmojis.bind(this);
    this.typing = debounce(this.typing, 500, {
      leading: true,
      maxWait: 1250,
    });
  }

  componentDidMount() {
    this.scrollBottom();
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

  scrollBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  async send() {
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
    console.log(code, data);
    const emote = emoji.replace_colons(`:${data.name}:`);

    this.setState({
      value: value + emote,
    });
  }

  toggleEmojis() {
    this.setState(prevState => ({
      showEmojis: !prevState.showEmojis,
    }));
  }

  render() {
    const { value, showEmojis } = this.state;

    return (
      <EditorContainer>
        <StyledEditor value={value} onChange={this.onChange} onKeyDown={this.onKeyDown} placeholder="Type any message ..." autoFocus />
        <SmileyButton color="link" size="sm" onClick={this.toggleEmojis} id="emoji-selector">
          <FontAwesomeIcon icon={faSmileBeam} size="lg" />
        </SmileyButton>
        <Tooltip innerClassName="emoji-tooltip" isOpen={showEmojis} hideArrow target="emoji-selector">
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
  token: state.user.tokens.token,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getConversation,
  newConversation,
  sendReply,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ConversationInput);
