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
// import Person from "@material-ui/icons/Person";
// import LibraryBooks from "@material-ui/icons/LibraryBooks";
// import BubbleChart from "@material-ui/icons/BubbleChart";
// import LocationOn from "@material-ui/icons/LocationOn";
// import Notifications from "@material-ui/icons/Notifications";
// import Unarchive from "@material-ui/icons/Unarchive";
// import Language from "@material-ui/icons/Language";

// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
// import UserProfile from "views/UserProfile/UserProfile.js";
// import TableList from "views/TableList/TableList.js";
// import Typography from "views/Typography/Typography.js";
// import Icons from "views/Icons/Icons.js";
// import Maps from "views/Maps/Maps.js";
// import NotificationsPage from "views/Notifications/Notifications.js";
// import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.js";

// core components/views for RTL layout
// import RTLPage from "views/RTLPage/RTLPage.js";
import { AttachFileRounded, HotelOutlined, RestaurantOutlined, CardGiftcardOutlined, SpaOutlined, ViewCarouselOutlined, FavoriteBorderOutlined, PoolOutlined, InsertDriveFileOutlined, PostAddOutlined, QuestionAnswerOutlined, ViewStreamOutlined, ArtTrackOutlined, HorizontalSplitOutlined } from "@material-ui/icons";
import AddOffer from "views/Offers/Add";
import OffersList from "views/Offers/List";
import AddPremiuimOffer from "views/Premiuim-offers/Add";
import PremiuimOffersList from "views/Premiuim-offers/List";
import RoomsList from "views/RoomsSuites/List";
import RoomDetail from "views/RoomsSuites/Details";
import AddRoom from "views/RoomsSuites/Add";
import BlogsList from "views/Blogs/List";
import BlogDetail from "views/Blogs/Details";
import AddBlog from "views/Blogs/Add";
import DiningList from "views/Dining/List";
import DiningDetail from "views/Dining/Details";
import DiningAdd from "views/Dining/Add";
import LeisureList from "views/Leisure/List";
import WeddingList from "views/Wedding/List";
import WeddingAdd from "views/Wedding/Add";

import LeisureAdd from "views/Leisure/Add";
import LeisureDetail from "views/Leisure/Details";
import WeddingDetail from "views/Wedding/Details";
import SpaWellnessList from "views/SpaWellness/List";
import SpaWellnessAdd from "views/SpaWellness/Add";
import PageAdd from "views/SitePages/Add";
import PageDetail from "views/SitePages/Details";
import PageList from "views/SitePages/List";
import Footer from "views/Footer/Add";
import UpdateHeader from "views/Header/Add";
import AddSustainability from "views/SitePages/Pages/Sustainability/Add";
import AddRoomsSuites from "views/SitePages/Pages/RoomsSuites/Add";
import LeisureActivities from "views/SitePages/Pages/leisureActivities/Add";
import AddLeisureInner from "views/SitePages/Pages/LeisureInner/Add";
import AddDiningInner from "views/SitePages/Pages/DiningInner/Add";
import AddAboutUs from "views/SitePages/Pages/About/Add";
import AddSpaWellness from "views/SitePages/Pages/SpaWellness/Add";
import AddPrivacyPolicy from "views/SitePages/Pages/PrivacyPolicy/Add";
import AddTermsOfUse from "views/SitePages/Pages/TermsOfUse/Add"
import AddCovidPolicy from "views/SitePages/Pages/CovidPolicy/Add";
import AddCancellationPolicy from "views/SitePages/Pages/CancellationPolicy/Add";
import AddWedding from "views/SitePages/Pages/Wedding/Add";
import AddAboutSeychelles from "views/SitePages/Pages/AboutSeychelles/Add";
import ParisFrenchRestaurant from "views/SitePages/Pages/ParisFrenchRestaurant/Add";
import AddGalleryPage from "views/SitePages/Pages/Gallery/Add";
import FAQPage from "views/SitePages/Pages/FAQ/Add";
import BlogPage from "views/SitePages/Pages/Blog/Add";
import OfferPage from "views/SitePages/Pages/Offers/Add";
import FAQList from "views/FAQ/List";
import GalleryList from "views/Gallery/List";
import AddGallery from "views/Gallery/Add";
import OfferDetail from "views/Offers/Details";
import PremiuimOfferDetail from "views/Premiuim-offers/Details";
import SignInSide from "views/Auth/Login";
import AddContactUs from "views/SitePages/Pages/Contact/Add";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  // {
  //   path: "/login",
  //   name: "Login",
  //   rtlName: "لوحة القيادة",
  //   icon: Dashboard,
  //   component: SignInSide,
  //   layout: "/",
  //   hide:true
  // },
  {
    path: "/room-suites",
    name: "Rooms & Suites",
    rtlName: "ملف تعريفي للمستخدم",
    icon: HotelOutlined,
    component: RoomsList,
    layout: "/admin",
    exact: true
  },
  {
    path: "/room-suites/add",
    component: AddRoom,
    layout: "/admin",
    hide: true,
    exact: true
  },
  {
    path: "/room-suites/edit/:id",
    component: AddRoom,
    layout: "/admin",
    hide: true,
    exact: true
  },
  {
    path: "/room-suites/:id",
    component: RoomDetail,
    layout: "/admin",
    hide: true,
    exact: true
  },
  {
    path: "/blogs",
    name: "Blogs",
    rtlName: "ملف تعريفي للمستخدم",
    icon: AttachFileRounded,
    component: BlogsList,
    layout: "/admin",
    exact: true
  },
  {
    path: "/blogs/add",
    component: AddBlog,
    layout: "/admin",
    hide: true,
    exact: true
  },
  {
    path: "/blogs/edit/:id",
    component: AddBlog,
    layout: "/admin",
    hide: true,
    exact: true
  },
  {
    path: "/blogs/:id",
    component: BlogDetail,
    layout: "/admin",
    hide: true,
    exact: true
  },
  {
    path: "/dining",
    name: "Restaurant & Bars",
    rtlName: "ملف تعريفي للمستخدم",
    icon: RestaurantOutlined,
    component: DiningList,
    layout: "/admin",
    exact: true
  },
  {
    path: "/dining/add",
    component: DiningAdd,
    layout: "/admin",
    hide: true,
    exact: true
  },
  {
    path: "/dining/edit/:id",
    component: DiningAdd,
    layout: "/admin",
    hide: true,
    exact: true
  },
  {
    path: "/dining/:id",
    component: DiningDetail,
    layout: "/admin",
    hide: true,
    exact: true
  },
  {
    path: "/weddings",
    name: "Weddings",
    rtlName: "ملف تعريفي للمستخدم",
    icon: FavoriteBorderOutlined,
    component: WeddingList,
    layout: "/admin",
    exact: true
  },
  {
    path: "/weddings/add",
    name: "Weddings",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: WeddingAdd,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/weddings/edit/:id",
    name: "Weddings",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: WeddingAdd,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/weddings/:id",
    name: "Weddings",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: WeddingDetail,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/offers",
    name: "Offers",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: OffersList,
    layout: "/admin",
    exact: true
  },
  {
    path: "/offers/add",
    name: "Offers",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: AddOffer,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/offers/edit/:id",
    name: "Offers",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: AddOffer,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/offers/:id",
    name: "Offers",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: OfferDetail,
    layout: "/admin",
    exact: true,
    hide: true
  },

  {
    path: "/premium-offers",
    name: "Premiuim Offers",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: PremiuimOffersList,
    layout: "/admin",
    exact: true
  },
  {
    path: "/premium-offers/add",
    name: "Premiuim Offers",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: AddPremiuimOffer,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/premium-offers/edit/:id",
    name: "Premiuim Offers",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: AddPremiuimOffer,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/premium-offers/:id",
    name: "Premiuim Offers",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: PremiuimOfferDetail,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/spa-wellness",
    name: "Spa & Wellness",
    rtlName: "ملف تعريفي للمستخدم",
    icon: SpaOutlined,
    component: SpaWellnessList,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/spa-wellness/add",
    name: "Spa & Wellness",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: SpaWellnessAdd,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/spa-wellness/:id",
    name: "Spa & Wellness",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: SpaWellnessList,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/whats-on",
    name: "Leisure Activities",
    rtlName: "ملف تعريفي للمستخدم",
    icon: PoolOutlined,
    component: LeisureList,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/whats-on/add",
    name: "Leisure Activities",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: LeisureAdd,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/whats-on/:id",
    name: "Leisure Activities",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: LeisureDetail,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/pages",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: InsertDriveFileOutlined,
    component: PageList,
    layout: "/admin",
    exact: true
  },
  {
    path: "/pages/add",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: PageAdd,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/pages/sustainability/add/:id",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: AddSustainability,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/pages/gallery/add/:id",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: AddGalleryPage,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/pages/paris-french-restaurant/add/:id",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: ParisFrenchRestaurant,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/pages/whats-on/add/:id",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: LeisureActivities,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/pages/faqs/add/:id",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: FAQPage,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/pages/blog/add/:id",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: BlogPage,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/pages/offers/add/:id",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: OfferPage,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/pages/leisure-inner/add/:id",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: AddLeisureInner,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/pages/fine-dining-seychelles/add/:id",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: AddDiningInner,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/pages/about-us/add/:id",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: AddAboutUs,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/pages/contact/add/:id",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: AddContactUs,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/pages/spa-wellness/add/:id",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: AddSpaWellness,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/pages/privacy-policy/add/:id",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: AddPrivacyPolicy,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/pages/terms-of-use/add/:id",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: AddTermsOfUse,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/pages/covid-policy/add/:id",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: AddCovidPolicy,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/pages/cancellation-policy/add/:id",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: AddCancellationPolicy,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/pages/wedding/add/:id",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: AddWedding,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/pages/rooms-suites-seychelles/add/:id",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: AddRoomsSuites,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/pages/about-seychelles/add/:id",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: AddAboutSeychelles,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/pages/:id",
    name: "Pages",
    rtlName: "ملف تعريفي للمستخدم",
    icon: CardGiftcardOutlined,
    component: PageDetail,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/gallery",
    name: "Media",
    rtlName: "ملف تعريفي للمستخدم",
    icon: ViewCarouselOutlined,
    component: GalleryList,
    layout: "/admin",
    exact: true,
    // hide: true
  },
  {
    path: "/gallery/add",
    name: "Gallery",
    rtlName: "ملف تعريفي للمستخدم",
    icon: ViewCarouselOutlined,
    component: AddGallery,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/gallery/:id",
    name: "Gallery",
    rtlName: "ملف تعريفي للمستخدم",
    icon: ViewCarouselOutlined,
    component: GalleryList,
    layout: "/admin",
    exact: true,
    hide: true
  },
  // {
  //   path: "/gallery",
  //   name: "Gallery",
  //   rtlName: "ملف تعريفي للمستخدم",
  //   icon: ViewCarouselOutlined,
  //   component: DashboardPage,
  //   layout: "/admin",
  //   exact: true
  // },
  {
    path: "/header",
    name: "Main Header",
    rtlName: "ملف تعريفي للمستخدم",
    icon: ArtTrackOutlined,
    component: UpdateHeader,
    layout: "/admin",
    exact: true
  },
  {
    path: "/footer",
    name: "Main Footer",
    rtlName: "ملف تعريفي للمستخدم",
    icon: HorizontalSplitOutlined,
    component: Footer,
    layout: "/admin",
    exact: true
  },
  {
    path: "/posts",
    name: "Posts",
    rtlName: "ملف تعريفي للمستخدم",
    icon: PostAddOutlined,
    component: UpdateHeader,
    layout: "/admin",
    exact: true,
    hide: true
  },
  {
    path: "/faq",
    name: "F.A.Q's",
    rtlName: "ملف تعريفي للمستخدم",
    icon: QuestionAnswerOutlined,
    component: FAQList,
    layout: "/admin",
    exact: true
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
