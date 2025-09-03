import img1 from "/public/images/landingpage/demos/demo-main.jpg";
import img2 from "/public/images/landingpage/demos/demo-dark.jpg";
import img3 from "/public/images/landingpage/demos/demo-horizontal.jpg";
import img4 from "/public/images/landingpage/demos/demo-mini.jpg";
import img5 from "/public/images/landingpage/demos/demo-rtl.jpg";
import defaultdemo from "/public/images/landingpage/demos/demo-default.jpg";

import img6 from "/public/images/landingpage/apps/app-calendar.jpg";
import img7 from "/public/images/landingpage/apps/app-chat.jpg";
import img8 from "/public/images/landingpage/apps/app-contact.jpg";
import img9 from "/public/images/landingpage/apps/app-user-profile.jpg";
import img10 from "/public/images/landingpage/apps/app-note.jpg";
import img11 from "/public/images/landingpage/apps/app-blog.jpg";
import img12 from "/public/images/landingpage/apps/app-shop.jpg";
import img13 from "/public/images/landingpage/apps/app-productlist.jpg";
import img14 from "/public/images/landingpage/apps/app-invoice.jpg";
import img15 from "/public/images/landingpage/apps/app-blog-detail.jpg";
import img16 from "/public/images/landingpage/apps/app-product-detail.jpg";
import img17 from "/public/images/landingpage/apps/app-kanban.jpg";

/*Front Pages Megamenu*/
import front1 from "/public/images/landingpage/front-pages/front-homepage.jpg";
import front2 from "/public/images/landingpage/front-pages/front-aboutus.jpg";
import front3 from "/public/images/landingpage/front-pages/front-contactus.jpg";
import front4 from "/public/images/landingpage/front-pages/front-portfolio.jpg";
import front5 from "/public/images/landingpage/front-pages/front-pricing.jpg";
import front6 from "/public/images/landingpage/front-pages/front-blog.jpg";

import {
  Icon,
  IconAdjustments,
  IconArchive,
  IconArrowsShuffle,
  IconBook,
  IconBrandTailwind,
  IconBuildingCarousel,
  IconCalendar,
  IconChartPie,
  IconDatabase,
  IconDiamond,
  IconLanguageKatakana,
  IconLayersIntersect,
  IconLockAccess,
  IconMessage,
  IconRefresh,
  IconShieldLock,
  IconTag,
  IconWand,
  IconBrandDouban,
} from "@tabler/icons-react";

interface DemoTypes {
  link: string;
  img: string | any;
  name: string;
  type: boolean;
  include: string;
}

const Demos: DemoTypes[] = [
  {
    type: true,
    img: img1,
    name: "Main",
    link: "https://material-m-nextjs-main.vercel.app/dashboards/analytics",
    include: "Demo",
  },
  {
    type: true,
    img: img2,
    name: "Dark",
    link: "https://material-m-nextjs-dark.vercel.app/dashboards/ecommerce",
    include: "Demo",
  },
  {
    type: true,
    img: img3,
    name: "Horizontal",
    link: "https://material-m-nextjs-horizontal.vercel.app/dashboards/crm",
    include: "Demo",
  },
  {
    type: true,
    img: img4,
    name: "Minisidebar",
    link: "https://material-m-nextjs-minisidebar.vercel.app/dashboards/analytics",
    include: "Demo",
  },
  {
    type: true,
    img: img5,
    name: "RTL",
    link: "https://material-m-nextjs-rtl.vercel.app/dashboards/ecommerce",
    include: "Demo",
  },
  {
    type: true,
    img: defaultdemo,
    name: "Default Sidebar",
    link: "https://material-m-nextjs-default.vercel.app/dashboards/crm",
    include: "Demo",
  },
  {
    type: false,
    img: img6,
    name: "Calandar App",
    link: "/apps/calendar",
    include: "Application",
  },
  {
    type: false,
    img: img7,
    name: "Chat App",
    link: "/apps/chats",
    include: "Application",
  },
  {
    type: false,
    img: img8,
    name: "Contact App",
    link: "/apps/contacts",
    include: "Application",
  },
  {
    type: false,
    img: img9,
    name: "User Profile App",
    link: "/apps/user-profile/profile",
    include: "Application",
  },
  {
    type: false,
    img: img10,
    name: "Notes App",
    link: "/apps/notes",
    include: "Application",
  },
  {
    type: false,
    img: img11,
    name: "Blog App",
    link: "/apps/blog/posts",
    include: "Application",
  },
  {
    type: false,
    img: img15,
    name: "Blog Detail App",
    link: "/apps/blog/detail/streaming-video-way-before-it-was-cool-go-dark-tomorrow",
    include: "Application",
  },
  {
    type: false,
    img: img12,
    name: "eCommerce Shop App",
    link: "/apps/ecommerce/shop",
    include: "Application",
  },
  {
    type: false,
    img: img16,
    name: "eCommerce Product Detail App",
    link: "/apps/ecommerce/detail/1",
    include: "Application",
  },
  {
    type: false,
    img: img13,
    name: "eCommerce Product List App",
    link: "/apps/ecommerce/list",
    include: "Application",
  },
  {
    type: false,
    img: img14,
    name: "Invoice App",
    link: "/apps/invoice/list",
    include: "Application",
  },
  {
    type: false,
    img: img17,
    name: "Kanban App",
    link: "/apps/kanban",
    include: "Application",
  },
];

interface ListFeatureTypes {
  featureicon: any;
  bgcolor: string;
  title: string;
  subtitle: string;
}

const listFeature: ListFeatureTypes[] = [
  {
    featureicon: IconWand,
    title: "6 Theme Colors",
    subtitle: "MaterialM Admin comes with 6 pre-defined theme colors.",
    bgcolor: "primary",
  },
  {
    featureicon: IconDiamond,
    title: "3400+ Font Icons",
    subtitle: "The MaterialM Admin package includes numerous icon fonts.",
    bgcolor: "success",
  },
  {
    featureicon: IconCalendar,
    title: "Calendar Design",
    subtitle: "Our package includes a well-designed calendar.",
    bgcolor: "primary",
  },
  {
    featureicon: IconBrandDouban,
    title: "4+ Frontend Pages",
    subtitle: "We have added useful frontend pages with MaterialM Admin",
    bgcolor: "error",
  },
  {
    featureicon: IconRefresh,
    title: "Regular Updates",
    subtitle: "We continuously enhance our pack with new features.",
    bgcolor: "warning",
  },
  {
    featureicon: IconArchive,
    title: "90+ Page Templates",
    subtitle:
      "Indeed, we offer 6 demos, each featuring over 90+ pages, to simplify the process.",
    bgcolor: "info",
  },
  {
    featureicon: IconAdjustments,
    title: "45+ UI Components",
    subtitle: "The MaterialM Admin Pack includes nearly 45 UI components.",
    bgcolor: "success",
  },
  {
    featureicon: IconBrandTailwind,
    title: "Tailwind",
    subtitle: "It is built using Tailwind, a robust UI component framework.",
    bgcolor: "warning",
  },
  {
    featureicon: IconBuildingCarousel,
    title: "Flowbite React",
    subtitle:
      "A utility-first CSS framework and UI component library for React applications.",
    bgcolor: "error",
  },

  {
    featureicon: IconShieldLock,
    title: "Firebase",
    subtitle:
      "offer robust real-time database capabilities, authentication, and additional features.",
    bgcolor: "error",
  },
  {
    featureicon: IconDatabase,
    title: "SWR",
    subtitle:
      "Swr provides way to fetch, cache, and update data in real-time applications.",
    bgcolor: "secondary",
  },
  {
    featureicon: IconLanguageKatakana,
    title: "i18 React",
    subtitle:
      "react-i18 is a robust framework for internationalization in React applications.",
    bgcolor: "primary",
  },

  {
    featureicon: IconLockAccess,
    title: "Next-Auth",
    subtitle:
      "We have integrated Google, GitHub, and Credential providers with NextAuth.",
    bgcolor: "primary",
  },

  {
    featureicon: IconLayersIntersect,
    title: "Lots of Table Examples",
    subtitle: "Tables are a fundamental requirement, and we've included them",
    bgcolor: "warning",
  },

  {
    featureicon: IconBook,
    title: "Detailed Documentation",
    subtitle:
      "We have created comprehensive documentation to make usage straightforward.",
    bgcolor: "secondary",
  },

  {
    featureicon: IconMessage,
    title: "Dedicated Support",
    subtitle:
      "We believe that exceptional support is essential, and we provide it.",
    bgcolor: "error",
  },
  {
    featureicon: IconChartPie,
    title: "Lots of Chart Options",
    subtitle:
      "With ApexCharts, we offer a wide variety of chart options if you can name it, we likely have it.",
    bgcolor: "success",
  },
];

/*User Review Section*/
import review1 from "/public/images/profile/user-2.jpg";
import review2 from "/public/images/profile/user-3.jpg";
import review3 from "/public/images/profile/user-4.jpg";

interface UserReviewTypes {
  img: any;
  review: string;
  title: string;
  subtitle: string;
}
const userReview: UserReviewTypes[] = [
  {
    img: review3,
    title: "Leslie Alexander",
    subtitle: "Product Designer, Appzio",
    review:
      "Such a beautiful, detailed, and extensive template. MaterialM admin is the perfect foundation for any project. I highly recommend this huge time saver.",
  },
  {
    img: review1,
    title: "Jenny Wilson",
    subtitle: "Features avaibility",
    review:
      "The dashboard template from wrappixel has helped me provide a cleanand sleek look to my dashboard and made it look exactly the way I wanted it to, mainly without having.",
  },
  {
    img: review2,
    title: "Minshan Cui",
    subtitle: "Features avaibility",
    review:
      "The quality of design is excellent, customizability and flexibility much better than the other products available in the market.I strongly recommend the wrappixel to other.",
  },
];

interface DemosMegaMenuTypes {
  img: any;
  name: string;
  link: string;
}

/*Demos Megamenu*/
const demosMegamenu: DemosMegaMenuTypes[] = [
  {
    img: img1,
    name: "Main",
    link: "https://material-m-nextjs-main.vercel.app/dashboards/analytics",
  },
  {
    img: img2,
    name: "Dark",
    link: "https://material-m-nextjs-dark.vercel.app/dashboards/ecommerce",
  },
  {
    img: img3,
    name: "Horizontal",
    link: "https://material-m-nextjs-horizontal.vercel.app/dashboards/crm",
  },
  {
    img: img4,
    name: "Minisidebar",
    link: "https://material-m-nextjs-minisidebar.vercel.app/dashboards/analytics",
  },
  {
    img: img5,
    name: "RTL",
    link: "https://material-m-nextjs-rtl.vercel.app/dashboards/ecommerce",
  },
];
const FrontMenu = [
  {
    img: front1,
    name: "Homepage",
    link: "/frontend-pages/homepage",
    include: "Frontend Pages",
  },
  {
    img: front2,
    name: "About Us",
    link: "/frontend-pages/aboutus",
    include: "Frontend Pages",
  },
  {
    img: front3,
    name: "Contact Us",
    link: "/frontend-pages/contact",
    include: "Frontend Pages",
  },
  {
    img: front4,
    name: "Portfolio",
    link: "/frontend-pages/portfolio",
    include: "Frontend Pages",
  },
  {
    img: front5,
    name: "Pricing",
    link: "/frontend-pages/pricing",
    include: "Frontend Pages",
  },
  {
    img: front6,
    name: "Blog",
    link: "/frontend-pages/blog",
    include: "Frontend Pages",
  },
];
const appsMegamenu: DemosMegaMenuTypes[] = [
  {
    img: img6,
    name: "Calandar App",
    link: "/apps/calendar",
  },
  {
    img: img7,
    name: "Chat App",
    link: "/apps/chats",
  },
  {
    img: img8,
    name: "Contact App",
    link: "/apps/contacts",
  },
  {
    img: img9,
    name: "User Profile App",
    link: "/apps/user-profile/profile",
  },
  {
    img: img10,
    name: "Notes App",
    link: "/apps/notes",
  },
];

export {
  Demos,
  listFeature,
  userReview,
  demosMegamenu,
  appsMegamenu,
  FrontMenu,
};
