export const NAV_TOGGLE = 'NAV_TOGGLE';
export const NAV_CLOSE = 'NAV_CLOSE';

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
