import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink as RRNavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from 'reactstrap';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faDiceD20 } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { closeNav, toggleNav } from '../../actions/ui';

library.add(faDiceD20);

class Header extends PureComponent {
  static defaultProps = {
    firstName: '',
    lastName: '',
  }

  static propTypes = {
    toggleNav: PropTypes.func.isRequired,
    closeNav: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.toggleHandler = this.toggleHandler.bind(this);
  }

  toggleHandler() {
    const { toggleNav } = this.props;

    toggleNav();
  }

  render() {
    const {
      closeNav,
      isAuthenticated,
      firstName,
      lastName,
    } = this.props;

    return (
      <Navbar color="dark" dark fixed="top">
        <NavbarBrand tag={RRNavLink} to="/" className="mr-0">
          <FontAwesomeIcon icon={faDiceD20} />
        </NavbarBrand>
        {
          isAuthenticated
          && (
          <Nav navbar>
            <NavItem>
              <NavLink tag={RRNavLink} to="/" onClick={closeNav} className="text-white small">
                { `${firstName} ${lastName}` }
              </NavLink>
            </NavItem>
          </Nav>
          )
        }
        <NavbarToggler onClick={this.toggleHandler} />
      </Navbar>
    );
  }
}

const mapStateToProps = state => ({
  navOpen: state.ui.navOpen,
  isAuthenticated: state.user.isAuthenticated,
  firstName: state.user.account.firstName,
  lastName: state.user.account.lastName,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  closeNav,
  toggleNav,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Header);
