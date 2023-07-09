import NavLinkAdapter from '@app/core/NavLinkAdapter';
import { Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

function ContactListItem(props) {
  const { contact } = props;
  const roles = {
    admin: 'Admin',
    user: 'Klient',
    staff: 'Kurič',
    obsluha: 'Obsluha kotolne',
    instalater: 'Inštalatér',
  };

  return (
    <>
      <ListItem
        className="px-32 py-16"
        sx={{ bgcolor: 'background.paper' }}
        button
        component={NavLinkAdapter}
        to={`/pouzivatelia/${contact.id}`}
      >
        {' '}
        <Tooltip title={contact.isPaid ? 'Zaplatené' : 'Nezaplatené'} placement="top" className="mr-10">
          <div className={`rounded-full w-12 h-12 ${contact.isPaid ? 'bg-green' : 'bg-red'} `}></div>
        </Tooltip>
        <ListItemAvatar>
          <Avatar alt={contact.name} src={contact.avatar || undefined} />
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
}

export default ContactListItem;
