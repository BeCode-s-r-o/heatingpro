import NavLinkAdapter from '@app/core/NavLinkAdapter';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

const ContactListItem = (props) => {
  const { contact } = props;
  const roles = { admin: 'Admin', user: 'Zákazník', guest: 'Hosť' };

  return (
    <>
      <ListItem
        className="px-32 py-16"
        sx={{ bgcolor: 'background.paper' }}
        button
        component={NavLinkAdapter}
        to={`/pouzivatelia/${contact.id}`}
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
                {Object.keys(roles).map((key) => contact.role === key && roles[key])}
              </Typography>
            </>
          }
        />
      </ListItem>
      <Divider />
    </>
  );
};

export default ContactListItem;
