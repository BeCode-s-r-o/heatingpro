// @ts-nocheck
import _ from "@lodash";
import FuseUtils from "src/@app/utils";
import mock from "../mock";
import mockApi from "../mock-api.json";

let notificationsDB = mockApi.components.examples.notifications.value;

mock.onGet("/api/notifications").reply((config) => {
  return [200, notificationsDB];
});

mock.onDelete("/api/notifications").reply((config) => {
  notificationsDB = [];
  return [200];
});

mock.onPost("/api/notifications").reply(({ data }) => {
  const newNotification = { id: FuseUtils.generateGUID(), ...JSON.parse(data) };

  notificationsDB.push(newNotification);

  return [200, newNotification];
});

mock.onDelete(/\/api\/notifications\/[^/]+/).reply((config) => {
  const { id } = config.url.match(/\/api\/notifications\/(?<id>[^/]+)/).groups;

  _.remove(notificationsDB, { id });

  return [200, id];
});
