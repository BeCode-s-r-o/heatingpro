import FuseUtils from '@app/utils';
import _ from '@lodash';
import getUnixTime from 'date-fns/getUnixTime';

function CommentModel(data) {
  data = data || {};

  return _.defaults(data, {
    id: FuseUtils.generateGUID(),
    type: 'comment',
    idMember: null,
    message: '',
    time: getUnixTime(new Date()),
  });
}

export default CommentModel;
