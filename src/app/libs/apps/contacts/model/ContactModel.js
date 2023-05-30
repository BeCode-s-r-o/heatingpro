import _ from '@lodash';

const ContactModel = (data) =>
  _.defaults(data || {}, {
    avatar: null,
    background: null,
    name: '',
    role: 'Klient',
    email: '',
    tags: '',
    birthNumber: '',
    phone: '',
    heaters: [],
    notes: '',
  });

export default ContactModel;
