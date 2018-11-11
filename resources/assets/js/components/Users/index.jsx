import React, { PureComponent } from 'react';
import axios from 'axios';

class Users extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };
  }

  async componentDidMount() {
    try {
      const json = await axios('/api/v1/user/');

      this.setState({
        users: json.users,
      });
    } catch (err) {
      // console.error(err);
    }
  }

  render() {
    const { users } = this.state;

    return (
      <React.Fragment>
        <h1>Users</h1>
        {
          users && users.map(user => <p key={user.id}>{`${user.firstName} ${user.lastName}`}</p>)
        }
      </React.Fragment>
    );
  }
}

export default Users;
