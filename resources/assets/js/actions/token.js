import axios from 'axios';
import ms from 'ms';

import { store } from '../components/App';

import { UPDATE_TOKENS } from './user';

export function updateTokens({ refreshToken }) {
  return async function (dispatch) {
    try {
      const data = JSON.stringify({
        refreshToken,
      });

      const json = await axios({
        method: 'POST',
        url: '/api/v1/account/token/',
        headers: {
          'Content-Type': 'application/json',
        },
        data,
      });

      console.log('Token refresh', json);

      if (json.status === 200) {
        const { user } = json.data;

        return dispatch({
          type: UPDATE_TOKENS,
          data: {
            user,
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
}


export function checkToken(cb) {
  return new Promise((resolve) => {
    const {
      refreshToken,
      createdAt,
    } = store.getState().user.tokens;

    const tokenShouldRefresh = new Date(createdAt).getTime() + ms('10 minutes');
    const currentTime = new Date(new Date().toISOString()).getTime();

    const shouldTokenRefresh = tokenShouldRefresh < currentTime;

    // console.log('When the token should refresh', new Date(tokenShouldRefresh));
    // console.log('Current time to check refresh', new Date(currentTime));
    // console.log('Should we refresh?', shouldTokenRefresh);

    if (shouldTokenRefresh) {
      store.dispatch(updateTokens({ refreshToken }));
    }

    resolve(cb);
  });
}
