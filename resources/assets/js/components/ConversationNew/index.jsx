import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Select from 'react-select';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Container } from 'reactstrap';

import ConversationInput from '../ConversationInput';

import { getUsers, newConversation, getConversations } from '../../actions/conversation';

const StyledSelect = styled(Select)`
  margin-top: 2rem;
`;

const StyledContainer = styled(Container)`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

class ConversationNew extends PureComponent {
  static defaultProps = {
    users: [],
  }

  static propTypes = {
    getUsers: PropTypes.func.isRequired,
    newConversation: PropTypes.func.isRequired,
    getConversations: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      email: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }).isRequired),
    userId: PropTypes.number.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
  }

  constructor(props) {
    super(props);

    this.changeHandler = this.changeHandler.bind(this);
  }

  async componentDidMount() {
    const { getUsers, token } = this.props;

    await getUsers({ token });
  }

  async changeHandler(option) {
    const {
      history,
      token,
      newConversation,
      getConversations,
    } = this.props;

    const id = await newConversation({
      id: option.value,
      token,
    });

    getConversations({ token });

    history.push(`/conversation/${id}`);
  }

  render() {
    const {
      match,
      history,
      users,
      userId,
    } = this.props;

    if (match.params.recipientId) {
      return (
        <StyledContainer>
          <div className="h6 text-muted text-center">Write your first message</div>
          <ConversationInput receiverId={match.params.recipientId} type="recipient" history={history} />
        </StyledContainer>
      );
    }

    if (!users.length) {
      return (null);
    }

    return (
      <StyledSelect
        isSearchable
        onChange={this.changeHandler}
        options={users
          .filter(user => user.id !== userId)
          .map(user => ({
            ...user,
            label: `${user.firstName} ${user.lastName}`,
            value: user.id,
          }))}
      />
    );
  }
}

const mapStateToProps = state => ({
  token: state.user.tokens.token,
  users: state.conversation.users,
  userId: state.user.account.id,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getUsers,
  newConversation,
  getConversations,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ConversationNew);
