import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import Ws from '@adonisjs/websocket-client';

import Message from '../Message';
import ConversationInput from '../ConversationInput';

import { getConversation, setConversation, newMessage } from '../../actions/conversation';

class Conversation extends PureComponent {
  static defaultProps = {
    messages: [],
  }

  static propTypes = {
    match: ReactRouterPropTypes.match.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    setConversation: PropTypes.func.isRequired,
    newMessage: PropTypes.func.isRequired,
    userId: PropTypes.number.isRequired,
    token: PropTypes.string.isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      conversationId: PropTypes.number.isRequired,
      userId: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
    })),
  }

  constructor(props) {
    super(props);

    const { match } = this.props;

    this.ws = Ws('ws://casper.local:3333');
    this.chat = this.ws.subscribe(`chat:${match.params.conversationId}`);

    this.state = {
      typing: false,
    };

    this.typingInterval = setInterval(() => {
      this.setState({
        typing: false,
      });
    }, 3000);
  }

  componentDidMount() {
    const {
      setConversation,
      newMessage,
      token,
      match,
      userId,
      history,
    } = this.props;

    if (!match.params.conversationId) {
      return;
    }

    this.ws
      .withJwtToken(token)
      .connect();

    this.chat.emit('open');

    this.chat.on('ready', ({
      id, createdAt, updatedAt, messages, users,
    }) => {
      setConversation({
        id,
        createdAt,
        updatedAt,
        messages,
        users,
      });
      this.scrollBottom();
    });

    this.chat.on('error', (error) => {
      console.log(error);
    });

    this.chat.on('close', () => {
    });

    this.chat.on('disconnected', () => {
      history.push('/');
    });

    this.chat.on('message', async (message) => {
      await newMessage(message);
      this.scrollBottom();
    });

    this.chat.on('typing', (user) => {
      if (user.id === userId) {
        return;
      }

      this.setState({
        typing: true,
      });

      this.scrollBottom();
    });
  }

  componentWillUnmount() {
    this.ws = null;
    this.chat = null;
    this.typingInterval = null;
  }

  scrollBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  render() {
    const {
      match,
      history,
      userId,
    } = this.props;
    let { messages } = this.props;
    const { typing } = this.state;

    if (!messages || !match.params.conversationId) {
      return (null);
    }

    messages = messages.map(message => ({
      ...message,
      sender: message.userId === userId,
    }));

    return (
      <Fragment>
        {
          messages.map(message => (
            <Message
              key={message.id}
              id={message.id}
              content={message.content}
              user={message.userId}
              sender={message.sender}
              createdAt={message.createdAt}
              updatedAt={message.updatedAt}
            />
          ))
        }
        {
          typing && (
            <SkeletonTheme color="#EEE" highlightColor="#DDD">
              <Skeleton
                width={10}
                count="3"
                style={{
                  marginLeft: '1rem',
                }}
              />
            </SkeletonTheme>
          )
        }
        <ConversationInput receiverId={match.params.conversationId} type="conversation" history={history} chat={this.chat} />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  token: state.user.tokens.token,
  messages: state.conversation.current.messages,
  userId: state.user.account.id,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getConversation,
  setConversation,
  newMessage,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);
