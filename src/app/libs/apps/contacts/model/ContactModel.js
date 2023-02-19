import _ from '@lodash';

const ContactModel = (data) =>
  _.defaults(data || {}, {
    avatar: null,
    background: null,
    name: '',
    role: 'Zákazník',
    email: '',
    birthNumber: '',
    phone: '',
    heaters: [{ heater: '', label: '' }],
    notes: '',
  });

export default ContactModel;
