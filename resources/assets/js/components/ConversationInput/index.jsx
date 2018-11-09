import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import styled from 'styled-components';
import { Button, Tooltip } from 'reactstrap';
import EmojiPicker from 'emoji-picker-react';
import EmojiConvertor from 'emoji-js';

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
    getConversation: PropTypes.func.isRequired,
    newConversation: PropTypes.func.isRequired,
    sendReply: PropTypes.func.isRequired,
    type: PropTypes.oneOf([
      'recipient',
      'conversation',
    ]).isRequired,
    receiverId: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      value: '',
      showEmojis: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.send = this.send.bind(this);
    this.addEmoji = this.addEmoji.bind(this);
    this.toggleEmojis = this.toggleEmojis.bind(this);
  }

  componentDidMount() {
    this.scrollBottom();
  }

  onKeyDown = (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    this.send();
  }

  onChange(event) {
    const { value } = event.target;

    this.setState({
      value,
    });
  }

  scrollBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  async send() {
    const { value } = this.state;

    if (value.length < 1) {
      return;
    }

    const {
      getConversation,
      newConversation,
      sendReply,
      type,
      receiverId,
      token,
    } = this.props;

    if (type === 'conversation') {
      await sendReply({
        conversationId: receiverId,
        message: value,
        token,
      });

      await getConversation({ conversationId: receiverId, token });
      this.scrollBottom();
    } else if (type === 'recipient') {
      const { history } = this.props;

      const conversationId = await newConversation({
        recipientId: receiverId,
        message: value,
        token,
      });

      history.push(`/conversation/${conversationId}`);
    }

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
  token: state.user.token,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getConversation,
  newConversation,
  sendReply,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ConversationInput);
