/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import BarChartRoundedIcon from "@material-ui/icons/BarChartRounded"
import FileCopyRoundedIcon from "@material-ui/icons/FileCopyRounded"
import ContactMailRoundedIcon from "@material-ui/icons/ContactMailRounded"
import DashboardRoundedIcon from "@material-ui/icons/DashboardRounded"
import PersonAddDisabledRoundedIcon from "@material-ui/icons/PersonAddDisabledRounded"
import ListAltRoundedIcon from "@material-ui/icons/ListAltRounded"
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded"
import SettingsRoundedIcon from "@material-ui/icons/SettingsRounded"
import StorageRoundedIcon from "@material-ui/icons/StorageRounded"

export default [
  {
    title: "Finances",
    pages: [
      {
        title: "Overview",
        href: "/overview",
        icon: DashboardRoundedIcon,
      },
      {
        title: "CSV",
        href: "/csv",
        icon: ListAltRoundedIcon,
        children: [
          {
            title: "Downloads",
            href: "/csv/download",
            icon: GetAppRoundedIcon,
          },
        ],
      },
      {
        title: "Finances Mailer",
        href: "/finances",
        icon: BarChartRoundedIcon,
        children: [
          {
            title: "Make PDF's",
            href: "/finances/settings",
            icon: FileCopyRoundedIcon,
          },
          {
            title: "Driver Files",
            href: "/finances/pdf-files",
            icon: ContactMailRoundedIcon,
          },
          {
            title: "Restricted",
            href: "/finances/restricted-drivers",
            icon: PersonAddDisabledRoundedIcon,
          },
        ],
      },
      {
        title: "Configuration",
        href: "/configuration",
        icon: SettingsRoundedIcon,
        children: [
          {
            title: "Database",
            href: "/configuration/database",
            icon: StorageRoundedIcon,
          },
        ],
      },
    ],
  },
]
