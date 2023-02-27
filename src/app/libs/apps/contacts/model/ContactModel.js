import _ from '@lodash';

const ContactModel = (data) =>
  _.defaults(data || {}, {
    avatar: null,
    background: null,
    name: '',
    role: 'Zákazník',
    email: '',
    tags: '',
    birthNumber: '',
    phone: '',
    heaters: [],
    notes: '',
  });

export default ContactModel;
