import Home from '@/components/pages/Home';
import Wishlist from '@/components/pages/Wishlist';
import Browse from '@/components/pages/Browse';
import Budget from '@/components/pages/Budget';
import Profile from '@/components/pages/Profile';
import BookDetail from '@/components/pages/BookDetail';
import Welcome from '@/components/pages/Welcome';

export const routes = {
  welcome: {
    id: 'welcome',
    label: 'Welcome',
    path: '/',
    icon: 'Home',
    component: Welcome,
    hideInNav: true
  },
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
    component: Home
  },
  wishlist: {
    id: 'wishlist',
    label: 'Wishlist',
    path: '/wishlist',
    icon: 'Heart',
    component: Wishlist
  },
  browse: {
    id: 'browse',
    label: 'Browse',
    path: '/browse',
    icon: 'Search',
    component: Browse
  },
  budget: {
    id: 'budget',
    label: 'Budget',
    path: '/budget',
    icon: 'PiggyBank',
    component: Budget
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    component: Profile
  },
  bookDetail: {
    id: 'bookDetail',
    label: 'Book Detail',
    path: '/book/:id',
    icon: 'Book',
    component: BookDetail,
    hideInNav: true
  }
};

export const routeArray = Object.values(routes);
export default routes;