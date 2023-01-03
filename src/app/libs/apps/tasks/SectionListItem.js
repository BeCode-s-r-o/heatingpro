import FuseSvgIcon from '@app/core/FuseSvgIcon';
import NavLinkAdapter from '@app/core/NavLinkAdapter';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Draggable } from 'react-beautiful-dnd';

function SectionListItem(props) {
  const { data, index } = props;
  return (
    <Draggable draggableId={data.id} index={index} type="list">
      {(provided, snapshot) => (
        <>
          <ListItem
            className="px-40 py-12 group"
            sx={{ bgcolor: 'background.default' }}
            button
            component={NavLinkAdapter}
            to={`/apps/tasks/${data.id}`}
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <div
              className="md:hidden absolute flex items-center justify-center inset-y-0 left-0 w-32 cursor-move md:group-hover:flex"
              {...provided.dragHandleProps}
            >
              <FuseSvgIcon sx={{ color: 'text.disabled' }} size={20}>
                heroicons-solid:menu
              </FuseSvgIcon>
            </div>
            <ListItemText classes={{ root: 'm-0', primary: 'font-semibold text-16 truncate' }} primary={data.title} />
          </ListItem>
          <Divider />
        </>
      )}
    </Draggable>
  );
}

export default SectionListItem;
