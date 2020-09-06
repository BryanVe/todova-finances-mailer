/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { lazy } from "react"
import { Redirect } from "react-router-dom"

import AuthLayout from "./layouts/Auth"
import DashboardLayout from "./layouts/Dashboard"
import ErrorLayout from "./layouts/Error"
import DownloadCSVView from "./pages/CSV"
import DatabaseConfigView from "./pages/Configuration"
import DriverFilesView from "./pages/Finances"
import NotSentFilesView from "./pages/NotSentFiles"
import PrivateRoute from "components/PrivateRoute"

const protectRoute = (component) => () => <PrivateRoute component={component} />

const routes = [
  {
    path: "/",
    exact: true,
    component: () => <Redirect to='/auth/login' />,
  },
  {
    path: "/auth",
    component: AuthLayout,
    routes: [
      {
        path: "/auth/login",
        exact: true,
        component: lazy(() => import("pages/Login")),
      },
      {
        path: "/auth/register",
        exact: true,
        component: lazy(() => import("pages/Register")),
      },
      {
        component: () => <Redirect to='/errors/404' />,
      },
    ],
  },
  {
    path: "/errors",
    component: ErrorLayout,
    routes: [
      {
        path: "/errors/401",
        exact: true,
        component: lazy(() => import("pages/Error401")),
      },
      {
        path: "/errors/404",
        exact: true,
        component: lazy(() => import("pages/Error404")),
      },
      {
        path: "/errors/500",
        exact: true,
        component: lazy(() => import("pages/Error500")),
      },
      {
        component: () => <Redirect to='/errors/404' />,
      },
    ],
  },
  {
    route: "*",
    component: DashboardLayout,
    routes: [
      {
        path: "/csv/download",
        exact: true,
        render: protectRoute(DownloadCSVView),
      },
      {
        path: "/configuration/database",
        exact: true,
        render: protectRoute(DatabaseConfigView),
      },
      {
        path: "/finances/pdf-files",
        exact: true,
        render: protectRoute(DriverFilesView),
      },
      {
        path: "/finances/not-sent",
        exact: true,
        render: protectRoute(NotSentFilesView),
      },
      {
        component: () => <Redirect to='/errors/404' />,
      },
    ],
  },
]

export default routes
