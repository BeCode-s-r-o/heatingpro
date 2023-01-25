import _ from '@lodash';
import Divider from '@mui/material/Divider';
import GlobalStyles from '@mui/material/GlobalStyles';
import PropTypes from 'prop-types';
import { memo } from 'react';
import { registerComponent } from './FuseNavItem';
import FuseNavHorizontalCollapse from './horizontal/types/FuseNavHorizontalCollapse';
import FuseNavHorizontalGroup from './horizontal/types/FuseNavHorizontalGroup';
import FuseNavHorizontalItem from './horizontal/types/FuseNavHorizontalItem';
import FuseNavHorizontalLink from './horizontal/types/FuseNavHorizontalLink';
import NavigationLayout from './vertical/FuseNavVerticalLayout1';
import FuseNavVerticalCollapse from './vertical/types/FuseNavVerticalCollapse';
import FuseNavVerticalGroup from './vertical/types/FuseNavVerticalGroup';
import FuseNavVerticalItem from './vertical/types/FuseNavVerticalItem';
import FuseNavVerticalLink from './vertical/types/FuseNavVerticalLink';

const inputGlobalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      '.popper-navigation-list': {
        '& .fuse-list-item': {
          padding: '8px 12px 8px 12px',
          height: 40,
          minHeight: 40,
          '& .fuse-list-item-text': {
            padding: '0 0 0 8px',
          },
        },
        '&.dense': {
          '& .fuse-list-item': {
            minHeight: 32,
            height: 32,
            '& .fuse-list-item-text': {
              padding: '0 0 0 8px',
            },
          },
        },
      },
    })}
  />
);

/*
Register Fuse Navigation Components
 */
registerComponent('vertical-group', FuseNavVerticalGroup);
registerComponent('vertical-collapse', FuseNavVerticalCollapse);
registerComponent('vertical-item', FuseNavVerticalItem);
registerComponent('vertical-link', FuseNavVerticalLink);
registerComponent('horizontal-group', FuseNavHorizontalGroup);
registerComponent('horizontal-collapse', FuseNavHorizontalCollapse);
registerComponent('horizontal-item', FuseNavHorizontalItem);
registerComponent('horizontal-link', FuseNavHorizontalLink);
registerComponent('vertical-divider', () => <Divider className="my-16" />);
registerComponent('horizontal-divider', () => <Divider className="my-16" />);

function FuseNavigation(props) {
  const options = _.pick(props, [
    'navigation',
    'layout',
    'active',
    'dense',
    'className',
    'onItemClick',
    'firstLevel',
    'selectedId',
  ]);

  if (props.navigation.length > 0) {
    return (
      <>
        {inputGlobalStyles}
        <NavigationLayout {...options} />
      </>
    );
  }
  return null;
}

FuseNavigation.propTypes = {
  navigation: PropTypes.array.isRequired,
};

FuseNavigation.defaultProps = {
  layout: 'vertical',
};

export default memo(FuseNavigation);
