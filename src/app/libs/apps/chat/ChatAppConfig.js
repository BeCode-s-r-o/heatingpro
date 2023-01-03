import { lazy } from 'react';
import ChatFirstScreen from './ChatFirstScreen';

const ChatApp = lazy(() => import('./ChatApp'));

const ChatAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'apps/chat',
      element: <ChatApp />,
      children: [
        {
          path: '',
          element: <ChatFirstScreen />,
        },
      ],
    },
  ],
};

export default ChatAppConfig;
