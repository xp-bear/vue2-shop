import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/login.vue";
import Home from "../components/home.vue";
import Welcome from "../components/welcome.vue";
import Users from "../components/User/users.vue";
import Rights from "../components/power/rights.vue";
import Roles from "../components/power/roles.vue";
import Cate from "../components/goods/cate.vue";
import Params from "../components/goods/params.vue";
import List from "../components/goods/list.vue";
import Add from "../components/goods/add.vue";
import Order from "../components/order/order.vue";
import Report from "../components/report/report.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    {
      path: "/home",
      component: Home,
      redirect: "/welcome",
      children: [
        { path: "/welcome", component: Welcome },
        { path: "/users", component: Users },
        { path: "/rights", component: Rights },
        { path: "/roles", component: Roles },
        { path: "/categories", component: Cate },
        { path: "/params", component: Params },
        { path: "/goods", component: List },
        { path: "/goods/add", component: Add },
        { path: "/orders", component: Order },
        { path: "/reports", component: Report }
      ]
    }
  ]
});

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to将要访问的路径
  //from代表从哪个路径跳转而来
  //next是一个函数，表示放行
  //next()放行 next('/login')强制跳转
  if (to.path === "/login") return next();
  //获取token
  const tokenstr = window.sessionStorage.getItem("token");
  if (!tokenstr) return next("/login");

  next();
});

export default router;
