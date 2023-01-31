import _ from '@lodash';
import Divider from '@mui/material/Divider';
import GlobalStyles from '@mui/material/GlobalStyles';
import PropTypes from 'prop-types';
import { memo } from 'react';
import { registerComponent } from './NavItem';

import NavigationLayout from './NavigationLayout';
import FuseNavVerticalCollapse from './NavVerticalCollapse';
import FuseNavVerticalGroup from './NavVerticalGroup';
import FuseNavVerticalItem from './NavVerticalItem';
import FuseNavVerticalLink from './NavVerticalLink';

const inputGlobalStyles = (
  <GlobalStyles
    styles={() => ({
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
