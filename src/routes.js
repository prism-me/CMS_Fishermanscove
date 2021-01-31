/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
import Language from "@material-ui/icons/Language";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import TableList from "views/TableList/TableList.js";
import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import Maps from "views/Maps/Maps.js";
import NotificationsPage from "views/Notifications/Notifications.js";
import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.js";
// core components/views for RTL layout
import RTLPage from "views/RTLPage/RTLPage.js";
import { HotelOutlined, RestaurantOutlined, CardGiftcardOutlined, SpaOutlined, ViewCarouselOutlined, FavoriteBorderOutlined, PoolOutlined } from "@material-ui/icons";
import AddOffer from "views/Offers/Add";
import OffersList from "views/Offers/List";
import RoomsList from "views/RoomsSuites/List";
import RoomDetail from "views/RoomsSuites/Details";
import AddRoom from "views/RoomsSuites/Add";
import DiningList from "views/Dining/List";
import DiningDetail from "views/Dining/Details";
import DiningAdd from "views/Dining/Add";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/room-suites",
    name: "Rooms & Suites",
    rtlName: "ملف تعريفي للمستخدم",
    icon: HotelOutlined,
    component: RoomsList,
    layout: "/admin",
    exact:true
  },
  {
    path: "/room-suites/add",
    component: AddRoom,
    layout: "/admin",
    hide: true,
    exact:true
  },
  {
    path: "/room-suites/:id",
    component: RoomDetail,
    layout: "/admin",
    hide: true,
    exact:true
  },
  {
    path: "/dining",
    name: "Restaurant & Bars",
    rtlName: "ملف تعريفي للمستخدم",
    icon: RestaurantOutlined ,
    component: DiningList,
    layout: "/admin",
    exact:true
  },
  {
    path: "/dining/add",
    component: DiningAdd,
    layout: "/admin",
    hide:true,
    exact:true
  },
  {
    path: "/dining/:id",
    component: DiningDetail,
    layout: "/admin",
    hide:true,
    exact:true
  },
  {
    path: "/weddings",
    name: "Weddings",
    rtlName: "ملف تعريفي للمستخدم",
    icon: FavoriteBorderOutlined ,
    component: OffersList,
    layout: "/admin",
    exact:true
  },
  {
    path: "/offers",
    name: "Offers",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined ,
    component: OffersList,
    layout: "/admin",
    exact:true
  },
  {
    path: "/offers/add",
    name: "Offers",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined ,
    component: AddOffer,
    layout: "/admin",
    exact:true,
    hide:true
  },
  {
    path: "/offers/:id",
    name: "Offers",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined ,
    component: OffersList,
    layout: "/admin",
    exact:true,
    hide:true
  },
  {
    path: "/spa-wellenss",
    name: "Spa & Wellness",
    rtlName: "ملف تعريفي للمستخدم",
    icon: SpaOutlined ,
    component: DashboardPage,
    layout: "/admin",
    exact:true
  },
  {
    path: "/whats-on",
    name: "Leisure Activities",
    rtlName: "ملف تعريفي للمستخدم",
    icon: PoolOutlined ,
    component: DashboardPage,
    layout: "/admin",
    exact:true
  },
  {
    path: "/gallery",
    name: "Gallery",
    rtlName: "ملف تعريفي للمستخدم",
    icon: ViewCarouselOutlined ,
    component: DashboardPage,
    layout: "/admin",
    exact:true
  },
  // {
  //   path: "/user",
  //   name: "User Profile",
  //   rtlName: "ملف تعريفي للمستخدم",
  //   icon: Person,
  //   component: UserProfile,
  //   layout: "/admin"
  // },
  // {
  //   path: "/table",
  //   name: "Table List",
  //   rtlName: "قائمة الجدول",
  //   icon: "content_paste",
  //   component: TableList,
  //   layout: "/admin"
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   rtlName: "طباعة",
  //   icon: LibraryBooks,
  //   component: Typography,
  //   layout: "/admin"
  // },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   rtlName: "الرموز",
  //   icon: BubbleChart,
  //   component: Icons,
  //   layout: "/admin"
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   rtlName: "خرائط",
  //   icon: LocationOn,
  //   component: Maps,
  //   layout: "/admin"
  // },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   rtlName: "إخطارات",
  //   icon: Notifications,
  //   component: NotificationsPage,
  //   layout: "/admin"
  // },
  // {
  //   path: "/rtl-page",
  //   name: "RTL Support",
  //   rtlName: "پشتیبانی از راست به چپ",
  //   icon: Language,
  //   component: RTLPage,
  //   layout: "/rtl"
  // },
  // {
  //   path: "/upgrade-to-pro",
  //   name: "Upgrade To PRO",
  //   rtlName: "التطور للاحترافية",
  //   icon: Unarchive,
  //   component: UpgradeToPro,
  //   layout: "/admin"
  // }
];

export default dashboardRoutes;
