import { TContact } from '@app/types/TContact';
import _ from '@lodash';

const ContactModel = (data?: any): TContact =>
  _.defaults(data || {}, {
    avatar: null,
    name: '',
    role: 'user',
    email: '',
    phone: '',
  });

export default ContactModel;
