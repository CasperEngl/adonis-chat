import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';

import ChatSidebar from '../ChatSidebar';
import Header from '../Header';
import Conversation from '../Conversation';
import ConversationNew from '../ConversationNew';
import Home from '../Home';
import ProtectedRoute from '../ProtectedRoute';
import SignIn from '../SignIn';
import SignUp from '../SignUp';
import Users from '../Users';

import { userAuthenticate } from '../../actions/user';
import { getConversations } from '../../actions/conversation';
import { closeNav } from '../../actions/ui';

class ChatApp extends PureComponent {
  static propTypes = {
    closeNav: PropTypes.func.isRequired,
    getConversations: PropTypes.func.isRequired,
    userAuthenticate: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
  }

  componentWillMount() {
    const { closeNav } = this.props;

    closeNav();
  }

  componentDidMount() {
    const {
      getConversations,
      userAuthenticate,
      token,
    } = this.props;

    if (!token) {
      return;
    }

    // getConversations({ token });
    userAuthenticate({ token });
  }

  render() {
    const { isAuthenticated } = this.props;

    return (
      <Router>
        <Fragment>
          <Header />
          <ChatSidebar />
          <Container className="content-wrapper">
            <Switch>
              <ProtectedRoute exact path="/" component={Home} isAuthenticated={isAuthenticated} />
              <ProtectedRoute exact path="/users" component={Users} isAuthenticated={isAuthenticated} />
              <Route exact path="/signin" component={SignIn} />
              <Route exact path="/signup" component={SignUp} />
              <ProtectedRoute exact path="/conversation/new/:recipientId?" component={ConversationNew} isAuthenticated={isAuthenticated} />
              <ProtectedRoute exact path="/conversation/:conversationId" component={Conversation} isAuthenticated={isAuthenticated} />
            </Switch>
          </Container>
        </Fragment>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated,
  token: state.user.tokens.token,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  userAuthenticate,
  getConversations,
  closeNav,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ChatApp);
