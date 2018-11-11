import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
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

import { userAuthenticate, userLogin } from '../../actions/user';

class SignIn extends PureComponent {
  static propTypes = {
    userAuthenticate: PropTypes.func.isRequired,
    userLogin: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    token: PropTypes.string.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      email: 'me@casperengelmann.com',
      password: '1234567890',
      error: '',
    };

    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);

    this.onSignIn = this.onSignIn.bind(this);
  }

  async onSignIn() {
    const {
      userAuthenticate,
      userLogin,
    } = this.props;
    const { email, password } = this.state;

    await userLogin({ email, password });
    await userAuthenticate({ token: this.getToken() });
  }

  getToken() {
    const { token } = this.props;

    return token;
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
    const { history, isAuthenticated } = this.props;
    const {
      error,
      email,
      password,
    } = this.state;

    const redirectBack = history.location.state ? history.location.state.from.pathname : '/';

    if (isAuthenticated) {
      return (
        <Redirect
          to={{
            pathname: redirectBack,
            state: {
              from: '/signin',
            },
          }}
        />
      );
    }

    return (
      <Card>
        <CardBody>
          {error ? <CardText>{error}</CardText> : null}
          <CardTitle>Sign in</CardTitle>
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
          <Button color="primary" onClick={this.onSignIn}>Sign In</Button>
          <Button tag={Link} to="/signup" color="link">Sign Up</Button>
        </CardBody>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated,
  token: state.user.tokens.token,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  userAuthenticate,
  userLogin,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
