import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import { TContact } from '@app/types/TContact';

const Root = styled(Tooltip)(() => ({
  width: 70,
  minWidth: 70,
  flex: '0 0 auto',
}));

const StyledStatus = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: 12,
  height: 12,
  bottom: 4,
  left: 44,
  border: `2px solid ${theme.palette.background.default}`,
  borderRadius: '50%',
  zIndex: 10,
}));

const ContactButton = ({ contact }: { contact: TContact }) => {
  return (
    <Root title={contact.name} placement="left">
      <Button className="contactButton rounded-0 py-4 h-auto min-h-auto max-h-none">
        <StyledStatus />

        <Avatar src={contact.avatar || ''} alt={contact.name}>
          {!contact.avatar || contact.avatar === '' ? contact.name[0] : ''}
        </Avatar>
      </Button>
    </Root>
  );
};

export default ContactButton;
