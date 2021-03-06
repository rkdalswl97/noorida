import Vue from 'vue';
import Router from 'vue-router';
import store from './../store/store';

/*  Pages  */
import LoginPage from '../pages/LoginPage';

const JoinPage = () => import('../pages/JoinPage');
const MainPage = () => import('../pages/MainPage');
const FindIdPage = () => import('../pages/FindIdPage');
const FindPasswordPage = () => import('../pages/FindPasswordPage');
const WritePage = () => import('../pages/WritePage');
const PostDetailPage = () => import('../pages/PostDetailPage');
const ProfilePage = () => import('../pages/ProfilePage');

/*  Tabs  */
const LocalNewsTab = () => import('../pages/tabs/local-news-tab/LocalNewsTab');
const SubscribeNewsTab = () => import('../pages/tabs/subscribe-news-tab/SubscribeNewsTab');
const HotNewsTab = () => import('../pages/tabs/hot-news-tab/HotNewsTab');

Vue.use(Router);

const requireAuth = () => (to, from, next) => {
  if (store.state.auth.loginStatus) {
    next();
  } else {
    next({ name: 'LoginPage' });
  }
};

export default new Router({
  routes: [
    {
      path: '',
      redirect: LoginPage,
    },
    {
      path: 'login',
      name: 'LoginPage',
      component: LoginPage,
      async beforeEnter(from, to, next) {
        await store.dispatch('auth/sessionLoginProcess');
        if (store.state.auth.loginStatus) {
          next({ name: 'LocalNewsTab' });
        } else {
          next();
        }
      },
    },
    {
      path: 'join',
      name: 'JoinPage',
      component: JoinPage,
    },
    {
      path: 'find-id',
      name: 'FindIdPage',
      component: FindIdPage,
    },
    {
      path: 'find-password',
      name: 'FindPasswordPage',
      component: FindPasswordPage,
    },
    {
      path: 'main',
      name: 'MainPage',
      component: MainPage,
      beforeEnter: requireAuth(),
      children: [
        { path: '', redirect: { name: 'LocalNewsTab' } },
        {
          path: 'local',
          name: 'LocalNewsTab',
          component: LocalNewsTab,
          async beforeEnter(to, from, next) {
            await store.dispatch('user/updateLocation');
            next();
          },
        },
        { path: 'subscribe', name: 'SubscribeNewsTab', component: SubscribeNewsTab },
        { path: 'hot', name: 'HotNewsTab', component: HotNewsTab },
      ],
    },
    {
      path: 'write',
      name: 'WritePage',
      component: WritePage,
    },
    {
      path: 'profile/:userId',
      name: 'ProfilePage',
      component: ProfilePage,
      async beforeEnter(to, from, next) {
        await store.dispatch('anotherUser/fetchAnotherUser', to.params.userId);
        next();
      },
      props: true,
    },
    {
      path: 'post/:contentId',
      name: 'PostDetailPage',
      component: PostDetailPage,
      props: true,
    },
    {
      path: '*',
      redirect: LoginPage,
    },
  ],
});
