import BarChartRoundedIcon from "@material-ui/icons/BarChartRounded"
import FileCopyRoundedIcon from "@material-ui/icons/FileCopyRounded"
import DashboardRoundedIcon from "@material-ui/icons/DashboardRounded"
import ListAltRoundedIcon from "@material-ui/icons/ListAltRounded"
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded"
import SettingsRoundedIcon from "@material-ui/icons/SettingsRounded"
import StorageRoundedIcon from "@material-ui/icons/StorageRounded"
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline"

export default [
  {
    title: "",
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
            title: "Driver files",
            href: "/finances/pdf-files",
            icon: FileCopyRoundedIcon,
          },
          {
            title: "Not sent files",
            href: "/finances/not-sent",
            icon: ErrorOutlineIcon,
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
