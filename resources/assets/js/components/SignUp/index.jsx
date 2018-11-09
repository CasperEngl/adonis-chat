import * as React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';
import { bindActionCreators } from 'redux';

import { userRegister } from '../../actions/user';

class SignUp extends React.PureComponent {
  static propTypes = {
    userRegister: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      email: 'me@casperengelmann.com',
      error: '',
      firstName: 'Casper',
      lastName: 'Engelmann',
      loggedIn: false,
      password: '1234567890',
    };

    this.changeFirstName = this.changeFirstName.bind(this);
    this.changeLastName = this.changeLastName.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);

    this.onSignUp = this.onSignUp.bind(this);
  }

  async onSignUp() {
    const { userRegister } = this.props;
    const {
      email,
      firstName,
      lastName,
      password,
    } = this.state;

    await userRegister({
      email,
      firstName,
      lastName,
      password,
    });

    this.setState({
      loggedIn: true,
    });
  }

  changeFirstName(event) {
    this.setState({
      firstName: event.target.value,
    });
  }

  changeLastName(event) {
    this.setState({
      lastName: event.target.value,
    });
  }

  changeEmail(event) {
    this.setState({
      email: event.target.value,
    });
  }

  changePassword(event) {
    this.setState({
      password: event.target.value,
    });
  }

  render() {
    const {
      isAuthenticated,
    } = this.props;
    const {
      firstName,
      lastName,
      email,
      password,
      error,
      loggedIn,
    } = this.state;

    if (isAuthenticated || loggedIn) {
      return (
        <Redirect to={{
          pathname: '/signin',
          state: {
            from: '/signup',
          },
        }}
        />
      );
    }

    return (
      <Card>
        <CardBody>
          {error ? <CardText>{error}</CardText> : null}
          <CardTitle>Sign up</CardTitle>
          <FormGroup>
            <Label for="firstName">First Name</Label>
            <Input
              type="text"
              placeholder="First name"
              id="firstName"
              value={firstName}
              onChange={this.changeFirstName}
            />
          </FormGroup>
          <FormGroup>
            <Label for="lastName">Last Name</Label>
            <Input
              type="email"
              placeholder="Last name"
              id="lastName"
              value={lastName}
              onChange={this.changeLastName}
            />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="email"
              placeholder="Email"
              id="email"
              value={email}
              onChange={this.changeEmail}
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type="password"
              placeholder="Password"
              id="password"
              value={password}
              onChange={this.changePassword}
            />
          </FormGroup>
          <Button color="primary" onClick={this.onSignUp}>Sign Up</Button>
          <Button tag={Link} to="/signin" color="link">Sign In</Button>
        </CardBody>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated,
});

const mapDisptachToProps = dispatch => bindActionCreators({
  userRegister,
}, dispatch);

export default connect(mapStateToProps, mapDisptachToProps)(SignUp);
