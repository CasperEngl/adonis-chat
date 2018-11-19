import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';

import Message from '../Message';
import ConversationInput from '../ConversationInput';

import { getConversation } from '../../actions/conversation';

class Conversation extends PureComponent {
  static defaultProps = {
    messages: [],
  }

  static propTypes = {
    userId: PropTypes.number.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    getConversation: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      conversation_id: PropTypes.number.isRequired,
      user_id: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      is_deleted: PropTypes.bool.isRequired,
      new: PropTypes.bool.isRequired,
      created_at: PropTypes.string.isRequired,
      updated_at: PropTypes.string.isRequired,
    })),
  }

  componentDidMount() {
    const { getConversation, token, match } = this.props;

    if (!match.params.conversationId) {
      return;
    }

    getConversation({ conversationId: match.params.conversationId, token });
  }

  render() {
    const { match, history, userId } = this.props;
    let { messages } = this.props;

    if (!messages || !match.params.conversationId) {
      return (null);
    }

    messages = messages.map(message => ({
      ...message,
      sender: message.user_id === userId,
    }));

    return (
      <Fragment>
        {
          messages.map(message => (
            <Message
              key={message.id}
              id={message.id}
              content={message.content}
              sender={message.sender}
              createdAt={message.created_at}
              updatedAt={message.updated_at}
            />
          ))
        }
        <ConversationInput receiverId={match.params.conversationId} type="conversation" history={history} />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  token: state.user.tokens.token,
  messages: state.conversation.currentConversation.messages,
  userId: state.user.account.id,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getConversation,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);
