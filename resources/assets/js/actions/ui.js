export const NAV_TOGGLE = 'NAV_TOGGLE';
export const NAV_CLOSE = 'NAV_CLOSE';
export const EMOJIS_TOGGLE = 'EMOJIS_TOGGLE';
export const EMOJIS_CLOSE = 'EMOJIS_CLOSE';

export function toggleNav() {
  return {
    type: NAV_TOGGLE,
  };
}

export function closeNav() {
  return {
    type: NAV_CLOSE,
  };
}

export function toggleEmojis() {
  return {
    type: EMOJIS_TOGGLE,
  };
}

export function closeEmojis() {
  return {
    type: EMOJIS_CLOSE,
  };
}
