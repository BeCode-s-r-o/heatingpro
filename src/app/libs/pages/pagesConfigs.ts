import { TSingleRouteConfigArray } from 'src/@app/types/TRoutes';
import ActivitiesPageConfig from './activities/ActivitiesPageConfig';
import AuthenticationPagesConfig from './authentication/AuthenticationPagesConfig';
import ErrorPagesConfig from './error/ErrorPageConfig';

const pagesConfigs: TSingleRouteConfigArray = [...AuthenticationPagesConfig, ErrorPagesConfig, ActivitiesPageConfig];

export default pagesConfigs;
