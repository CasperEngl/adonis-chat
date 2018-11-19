import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { NavLink as RRNavLink } from 'react-router-dom';
import Sidebar from 'react-sidebar';
import {
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import {
  bindActionCreators,
} from 'redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

import { closeNav, toggleNav } from '../../actions/ui';
import { userLogout } from '../../actions/user';

library.add(faSignOutAlt);

class ChatSidebar extends Component {
  static propTypes = {
    closeNav: PropTypes.func.isRequired,
    toggleNav: PropTypes.func.isRequired,
    userLogout: PropTypes.func.isRequired,
    navOpen: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    token: PropTypes.string.isRequired,
    refreshToken: PropTypes.string.isRequired,
    conversations: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
      message: PropTypes.shape({
        id: PropTypes.number.isRequired,
        conversation_id: PropTypes.number.isRequired,
        user_id: PropTypes.number.isRequired,
        content: PropTypes.string.isRequired,
        seen: PropTypes.bool.isRequired,
        is_deleted: PropTypes.bool.isRequired,
        created_at: PropTypes.string.isRequired,
        updated_at: PropTypes.string.isRequired,
      }),
      users: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        first_name: PropTypes.string.isRequired,
        last_name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired,
        updated_at: PropTypes.string.isRequired,
      })),
    })).isRequired,
  }

  constructor(props) {
    super(props);

    this.openSidebar = this.openSidebar.bind(this);
    this.logout = this.logout.bind(this);
  }

  openSidebar() {
    const { toggleNav } = this.props;

    toggleNav();
  }

  logout() {
    const {
      userLogout,
      closeNav,
      token,
      refreshToken,
    } = this.props;

    userLogout({ token, refreshToken });
    closeNav();
  }

  render() {
    const {
      closeNav,
      navOpen,
      isAuthenticated,
      conversations,
    } = this.props;

    return (
      <Sidebar
        open={navOpen}
        onSetOpen={this.openSidebar}
        styles={{
          sidebar: {
            position: 'fixed',
            background: 'white',
          },
          overlay: {
            position: 'fixed',
          },
        }}
        touch
        sidebarClassName="sidebar-menu d-flex flex-column justify-content-between"
        sidebar={(
          <Fragment>
            <Nav vertical>
              <NavItem>
                <NavLink tag={RRNavLink} to="/conversation/new" onClick={closeNav}>
                  New Conversation
                </NavLink>
                {
                  conversations
                    .sort(conversation => (
                      new Date(conversation.updatedAt).getTime() - new Date().getTime()
                    ))
                    .map(conversation => (
                      <NavLink key={conversation.id} tag={RRNavLink} to={`/conversation/${conversation.id}`} onClick={closeNav}>
                        {
                          conversation.users.map(user => (
                            <Fragment key={user.id}>
                              {`${user.first_name} `}
                            </Fragment>
                          ))
                        }
                      </NavLink>
                    ))
                }
              </NavItem>
            </Nav>
            <Nav vertical>
              {
                isAuthenticated && (
                <NavItem>
                  <NavLink tag={RRNavLink} to="/signin" onClick={this.logout}>
                    Sign out
                    {' '}
                    <FontAwesomeIcon icon={faSignOutAlt} />
                  </NavLink>
                </NavItem>
                )
              }
              {
                !isAuthenticated && (
                  <Fragment>
                    <NavItem>
                      <NavLink tag={RRNavLink} to="/signup" onClick={closeNav}>
                        Register
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={RRNavLink} to="/signin" onClick={closeNav}>
                        Login
                      </NavLink>
                    </NavItem>
                  </Fragment>
                )
              }
            </Nav>
          </Fragment>
      )}
      >
        {' '}

      </Sidebar>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated,
  token: state.user.tokens.token,
  refreshToken: state.user.tokens.refreshToken,
  navOpen: state.ui.navOpen,
  conversations: state.conversation.conversations,
  id: state.user.account.id,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  closeNav,
  userLogout,
  toggleNav,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ChatSidebar);
