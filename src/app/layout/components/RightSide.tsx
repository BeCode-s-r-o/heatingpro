import { memo } from 'react';
import ChatPanel from '../shared-components/chatPanel/ChatPanel';
import QuickPanel from '../shared-components/quickPanel/QuickPanel';
import NotificationPanel from '../shared-components/notificationPanel/NotificationPanel';

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
