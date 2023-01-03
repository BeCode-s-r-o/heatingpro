import { memo } from 'react';
import ChatPanel from '../shared/chatPanel/ChatPanel';
import NotificationPanel from '../shared/notificationPanel/NotificationPanel';
import QuickPanel from '../shared/quickPanel/QuickPanel';

function RightSide() {
  return (
    <>
      <ChatPanel />
      <QuickPanel />
      <NotificationPanel />
    </>
  );
}

export default memo(RightSide);
