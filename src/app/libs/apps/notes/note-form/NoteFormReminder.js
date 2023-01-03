import FuseSvgIcon from '@app/core/FuseSvgIcon';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function NoteFormReminder(props) {
  const reminder = new Date(props.reminder);
  return (
    <DateTimePicker
      clearable
      showTodayButton
      disablePast
      value={reminder}
      onChange={props.onChange}
      renderInput={(_props) => (
        <TextField
          sx={{
            '& .MuiInputAdornment-root': {
              minWidth: 40,
              minHeight: 40,
              m: 0,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              display: 'none',
            },
            '& .MuiOutlinedInput-root': {
              padding: 0,
            },
            '& .MuiInputBase-input': {
              position: 'absolute',
              pointerEvents: 'none',
              visibility: 'hidden',
            },
          }}
          {..._props}
        />
      )}
      components={{
        OpenPickerIcon: () => <FuseSvgIcon size={20}>heroicons-outline:bell</FuseSvgIcon>,
      }}
    />
  );
}

export default NoteFormReminder;
