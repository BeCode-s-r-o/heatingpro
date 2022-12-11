import history from "@history";
import { useLayoutEffect, useState } from "react";
import { Router } from "react-router-dom";

interface BrowserRouterProps {
  basename?: string;
  children: React.ReactNode;
  window?: Window;
}

function BrowserRouter({ basename, children, window }: BrowserRouterProps) {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      basename={basename}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    >
      {children}
    </Router>
  );
}

export default BrowserRouter;
