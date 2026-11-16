const isNavigationState = (state: unknown): state is Record<string, unknown> =>
  typeof state === 'object' && state !== null && !Array.isArray(state);

export const readPhotoBlurNoticeState = (state: unknown) =>
  isNavigationState(state) &&
  Object.hasOwn(state, 'showPhotoBlurNotice') &&
  state.showPhotoBlurNotice === true;

export const clearPhotoBlurNoticeState = (state: unknown) => {
  if (!isNavigationState(state)) return null;

  const nextState = {...state};
  delete nextState.showPhotoBlurNotice;

  return Object.keys(nextState).length > 0 ? nextState : null;
};
