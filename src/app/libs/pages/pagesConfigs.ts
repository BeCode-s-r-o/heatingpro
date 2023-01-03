import { TSingleRouteConfigArray } from 'src/@app/types/TRoutes';
import activitiesPageConfig from './activities/activitiesPageConfig';
import authenticationPagesConfig from './authentication/authenticationPagesConfig';
import errorPagesConfig from './error/errorPagesConfig';
import invoicePagesConfig from './invoice/invoicePagesConfig';
import pricingPagesConfig from './pricing/pricingPagesConfig';

const pagesConfigs: TSingleRouteConfigArray = [
  ...authenticationPagesConfig,
  errorPagesConfig,
  invoicePagesConfig,
  activitiesPageConfig,
  pricingPagesConfig,
];

export default pagesConfigs;
