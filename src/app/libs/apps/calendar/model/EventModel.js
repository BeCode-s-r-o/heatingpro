import _ from '@lodash';

const EventModel = (data) =>
  _.defaults(data || {}, {
    title: '',
    deviceID: '',
    allDay: true,
    start: new Date(),
    end: new Date(),
    extendedProps: { desc: '', label: '' },
  });

export default EventModel;
