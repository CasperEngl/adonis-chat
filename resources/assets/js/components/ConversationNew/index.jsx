import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Select from 'react-select';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Container } from 'reactstrap';

import ConversationInput from '../ConversationInput';

import { getUsers } from '../../actions/conversation';

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
    token: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      email: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }).isRequired),
    history: ReactRouterPropTypes.history.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
  }

  constructor(props) {
    super(props);

    this.users = [];

    this.changeHandler = this.changeHandler.bind(this);
  }

  componentWillMount() {
    const { getUsers, token } = this.props;

    getUsers({ token });
  }

  componentDidMount() {
    const { users } = this.props;

    this.users = users.map(user => ({
      ...user,
      label: `${user.firstName} ${user.lastName}`,
      value: user.id,
    }));

    if (this.users[0] === undefined) {
      this.users[0] = {
        label: 'No users found.',
      };
    }
  }

  changeHandler(option) {
    const { history } = this.props;

    history.push(`/conversation/new/${option.value}`);
  }

  render() {
    const { match, history } = this.props;

    if (match.params.recipientId) {
      return (
        <StyledContainer>
          <div className="h6 text-muted text-center">Write your first message</div>
          <ConversationInput receiverId={match.params.recipientId} type="recipient" history={history} />
        </StyledContainer>
      );
    }

    if (!this.users.length) {
      return (null);
    }

    return (
      <StyledSelect
        isSearchable
        onChange={this.changeHandler}
        options={this.users}
      />
    );
  }
}

const mapStateToProps = state => ({
  token: state.user.token,
  users: state.conversation.users,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getUsers,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ConversationNew);
