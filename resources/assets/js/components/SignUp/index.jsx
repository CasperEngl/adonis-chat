import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import validator from 'validator';
import capitalize from 'capitalize';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';
import { bindActionCreators } from 'redux';

import { userRegister } from '../../actions/user';

class SignUp extends PureComponent {
  static propTypes = {
    userRegister: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      email: 'me@casperengelmann.com',
      firstName: 'Casper',
      lastName: 'Engelmann',
      password: '1234567890',
      error: false,
      errorField: '',
      registered: false,
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

    if (!validator.isEmail(email)) {
      return this.setState({
        error: 'I think you\'ve made an error. Check your email address to see that it was entered correctly.',
        errorField: 'email',
      });
    }

    if (!validator.isAlpha(firstName)) {
      return this.setState({
        error: 'Your name cannot contain any numerics.',
        errorField: 'firstName',
      });
    }

    if (!validator.isAlpha(lastName)) {
      return this.setState({
        error: 'Your last name should not have any numerics in it.',
        errorField: 'lastName',
      });
    }

    if (!validator.isLength(password, {
      min: 8,
      max: 100,
    })) {
      return this.setState({
        error: 'Make sure that your password is at least 8 characters long',
        errorField: 'password',
      });
    }

    const json = await userRegister({
      email: validator.normalizeEmail(email),
      firstName,
      lastName,
      password,
    });

    this.setState({
      registered: json.success,
    });
  }

  changeFirstName(event) {
    const { value } = event.target;

    if (value.length && !validator.isAlpha(value) && !value.includes('-') || value.includes('--')) {
      return;
    }

    this.setState({
      firstName: capitalize(value),
    });
  }

  changeLastName(event) {
    const { value } = event.target;

    if (value.length &&!validator.isAlpha(value)) {
      return;
    }

    this.setState({
      lastName: capitalize(value),
    });
  }

  changeEmail(event) {
    const { value } = event.target;

    this.setState({
      email: event.target.value,
    });
  }

  changePassword(event) {
    const { value } = event.target;

    this.setState({
      password: value,
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
      errorField,
      registered,
    } = this.state;

    if (isAuthenticated || registered) {
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
            { error && errorField === 'firstName' && <CardText className="text-danger">{ error }</CardText> }
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
            { error && errorField === 'lastName' && <CardText className="text-danger">{ error }</CardText> }
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
            { error && errorField === 'email' && <CardText className="text-danger">{ error }</CardText> }
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
            { error && errorField === 'password' && <CardText className="text-danger">{ error }</CardText> }
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
