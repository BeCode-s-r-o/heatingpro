import { AppContext } from "@app/context";
import { withRouter } from "@app/core";
import { FuseUtils } from "@app/utils";
import history from "@history";
import { Component } from "react";
import { matchRoutes } from "react-router-dom";

interface FuseAuthorizationProps {
  loginRedirectUrl?: string;
  accessGranted?: boolean;
  location: any;
  userRole: any;
  children: any;
}

interface FuseAuthorizationState {
  accessGranted: boolean;
  routes: any;
}

interface FuseAuthorizationContext {
  routes: any;
}

interface FuseAuthorization {
  defaultLoginRedirectUrl: string;
}

let loginRedirectUrl: null | string = null;

class FuseAuthorization extends Component<
  FuseAuthorizationProps,
  FuseAuthorizationState
> {
  constructor(
    props: FuseAuthorizationProps,
    context: FuseAuthorizationContext
  ) {
    super(props);
    const { routes } = context;
    this.state = {
      accessGranted: true,
      routes,
    };
    this.defaultLoginRedirectUrl = props.loginRedirectUrl || "/";
  }

  componentDidMount() {
    if (!this.state.accessGranted) {
      this.redirectRoute();
    }
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return nextState.accessGranted !== this.state.accessGranted;
  }

  componentDidUpdate() {
    if (!this.state.accessGranted) {
      this.redirectRoute();
    }
  }

  static getDerivedStateFromProps(props: any, state: any) {
    const { location, userRole } = props;
    const { pathname } = location;

    const matchedRoutes = matchRoutes(state.routes, pathname);

    const matched = matchedRoutes ? matchedRoutes[0] : false;
    return {
      accessGranted: matched
        ? FuseUtils.hasPermission(matched.route, userRole) //bolo tu matched.route.auth
        : true,
    };
  }

  redirectRoute() {
    const { location, userRole } = this.props;
    const { pathname } = location;
    const redirectUrl = loginRedirectUrl || this.defaultLoginRedirectUrl;

    /*
        User is guest
        Redirect to Login Page
        */
    if (!userRole || userRole.length === 0) {
      setTimeout(() => history.push("/sign-in"), 0);
      loginRedirectUrl = pathname;
    } else {
      /*
        User is member
        User must be on unAuthorized page or just logged in
        Redirect to dashboard or loginRedirectUrl
        */
      setTimeout(() => history.push(redirectUrl), 0);
      loginRedirectUrl = this.defaultLoginRedirectUrl;
    }
  }

  render() {
    // console.info('Fuse Authorization rendered', this.state.accessGranted);
    return this.state.accessGranted ? <>{this.props.children}</> : null;
  }
}

FuseAuthorization.contextType = AppContext;

export default withRouter(FuseAuthorization);
