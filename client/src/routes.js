/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { lazy } from "react"
import { Redirect } from "react-router-dom"

import AuthLayout from "./layouts/Auth"
import DashboardLayout from "./layouts/Dashboard"
// import DashboardDefaultView from "./pages/DashboardDefault"
import OverviewView from "./pages/Overview"
import DownloadCSVView from "./pages/CSV"
import DatabaseConfigView from "./pages/Configuration"
// import PresentationView from "./pages/Presentation"

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
      // {
      //   component: () => <Redirect to='/errors/error-404' />,
      // },
    ],
  },
  // {
  //   path: "/errors",
  //   component: ErrorLayout,
  //   routes: [
  //     {
  //       path: "/errors/error-401",
  //       exact: true,
  //       component: lazy(() => import("pages/Error401")),
  //     },
  //     {
  //       path: "/errors/error-404",
  //       exact: true,
  //       component: lazy(() => import("pages/Error404")),
  //     },
  //     {
  //       path: "/errors/error-500",
  //       exact: true,
  //       component: lazy(() => import("pages/Error500")),
  //     },
  //     {
  //       component: () => <Redirect to='/errors/error-404' />,
  //     },
  //   ],
  // },
  {
    route: "*",
    component: DashboardLayout,
    routes: [
      {
        path: "/overview",
        exact: true,
        component: OverviewView,
      },
      {
        path: "/csv/download",
        exact: true,
        component: DownloadCSVView,
      },
      {
        path: "/configuration/database",
        exact: true,
        component: DatabaseConfigView,
      },
      // {
      //   component: () => <Redirect to='/errors/error-404' />,
      // },
    ],
  },
]

export default routes
