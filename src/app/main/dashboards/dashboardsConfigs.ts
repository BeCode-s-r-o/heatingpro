import { TSingleRouteConfigArray } from 'src/app/types/TRoutes';
import AnalyticsDashboardAppConfig from './analytics/AnalyticsDashboardAppConfig';
import ProjectDashboardAppConfig from './systems/SystemsDashboardConfig';

const dashboardsConfigs: TSingleRouteConfigArray = [AnalyticsDashboardAppConfig, ProjectDashboardAppConfig];

export default dashboardsConfigs;
