import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';

import ChatSidebar from '../ChatSidebar';
import Header from '../Header';
import ProtectedRoute from '../ProtectedRoute';

import Conversation from '../Conversation';
import ConversationNew from '../ConversationNew';
import Home from '../Home';
import SignIn from '../SignIn';
import SignUp from '../SignUp';
import Users from '../Users';

import { getConversations } from '../../actions/conversation';
import { closeNav } from '../../actions/ui';

class ChatApp extends PureComponent {
  static propTypes = {
    closeNav: PropTypes.func.isRequired,
    getConversations: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);

    // this.checkTokenInterval = ms('1 seconds');
  }

  componentDidMount() {
    const {
      closeNav,
      getConversations,
      token,
    } = this.props;

    // this.tokenInterval = setInterval(() => {
    //   const {
    //     isAuthenticated,
    //     refreshToken,
    //     tokenCreatedAt,
    //   } = this.props;

    //   const tokenShouldRefresh = new Date(tokenCreatedAt).getTime() + ms('1 minute');
    //   const currentTime = new Date(new Date().toISOString()).getTime();

    //   const shouldTokenRefresh = tokenShouldRefresh < currentTime;

    //   // console.log('When the token should refresh', new Date(tokenShouldRefresh));
    //   // console.log('Current time to check refresh', new Date(currentTime));
    //   // console.log('Should we refresh?', shouldTokenRefresh);

    //   if (isAuthenticated && shouldTokenRefresh) {
    //     // updateTokens({ refreshToken });
    //   }
    // }, this.checkTokenInterval);

    closeNav();
    // getConversations({ token });
  }

  componentWillUnmount() {
    clearInterval(this.tokenInterval);
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
  getConversations,
  closeNav,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ChatApp);
