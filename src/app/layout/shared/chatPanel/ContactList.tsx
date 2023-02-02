import FuseScrollbars from '@app/core/Scrollbars';
import { TContact } from '@app/types/TContact';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { memo } from 'react';
import ContactButton from './ContactButton';

const Root = styled(FuseScrollbars)(({ theme }) => ({
  background: theme.palette.background.paper,
}));

const ContactList = ({ contacts }: { contacts: TContact[] }) => {
  return (
    <Root
      className="flex shrink-0 flex-col overflow-y-auto py-8 overscroll-contain"
      option={{ suppressScrollX: true, wheelPropagation: false }}
    >
      <motion.div initial="hidden" animate="show" className="flex flex-col shrink-0">
        {(contacts || [])?.map((contact, index) => {
          return (
            <motion.div key={index}>
              <ContactButton contact={contact} />
            </motion.div>
          );
        })}
      </motion.div>
    </Root>
  );
};

export default memo(ContactList);
