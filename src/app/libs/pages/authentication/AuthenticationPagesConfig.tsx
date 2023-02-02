import confirmationRequiredPagesConfig from './confirmation-required/confirmationRequiredPagesConfig';
import resetPasswordPagesConfig from './reset-password/resetPasswordPagesConfig';
import unlockSessionPagesConfig from './unlock-session/unlockSessionPagesConfig';

const authenticationPagesConfigs = [
  resetPasswordPagesConfig,
  confirmationRequiredPagesConfig,
  unlockSessionPagesConfig,
];

export default authenticationPagesConfigs;
