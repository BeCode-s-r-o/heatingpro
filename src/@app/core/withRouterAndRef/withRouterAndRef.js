import withRouter from '@app/core/withRouter';
import { Component, forwardRef } from 'react';

const withRouterAndRef = (WrappedComponent) => {
  class InnerComponentWithRef extends Component {
    render() {
      const { forwardRef: _forwardRef, ...rest } = this.props;
      return <WrappedComponent {...rest} ref={_forwardRef} />;
    }
  }

  const ComponentWithRouter = withRouter(InnerComponentWithRef, { withRef: true });
  return forwardRef((props, ref) => <ComponentWithRouter {...props} forwardRef={ref} />);
};

export default withRouterAndRef;
