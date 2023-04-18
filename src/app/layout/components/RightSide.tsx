import { selectUser } from 'app/store/userSlice';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import ChatPanel from '../shared/chatPanel/ChatPanel';
import QuickPanel from '../shared/quickPanel/QuickPanel';

function RightSide() {
  const user = useSelector(selectUser);
  return (
    <>
      {/* {user.role === 'admin' && <ChatPanel />} */}
      <QuickPanel />
      {/* <NotificationPanel /> */}
    </>
  );
}

export default memo(RightSide);
