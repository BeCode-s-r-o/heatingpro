import NavLinkAdapter from '@app/core/NavLinkAdapter';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

function ContactListItem(props) {
  const { contact } = props;
  return (
    <>
      <ListItem
        className="px-32 py-16"
        sx={{ bgcolor: 'background.paper' }}
        button
        component={NavLinkAdapter}
        to={`/apps/contacts/${contact.id}`}
      >
        <ListItemAvatar>
          <Avatar alt={contact.name} />
        </ListItemAvatar>
        <ListItemText
          classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
          primary={contact.name}
          secondary={
            <>
              <Typography className="inline" component="span" variant="body2" color="text.secondary">
                {contact.role === 'customer' ? 'Zákazník' : contact.role}
              </Typography>
            </>
          }
        />
      </ListItem>
      <Divider />
    </>
  );
}

export default ContactListItem;
