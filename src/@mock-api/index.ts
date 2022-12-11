// @ts-nocheck
import history from "@history";
import "./api/auth-api";
import "./api/notifications-api";
import mock from "./mock";

mock.onAny().passThrough();

if (module?.hot?.status() === "apply") {
  const { pathname } = history.location;
  history.push("/loading");
  history.push({ pathname });
}
