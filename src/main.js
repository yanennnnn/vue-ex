// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App'
import router from './router'
import './bus';
import VeeValidate from 'vee-validate'; //使用驗證套件
import zhTWValidate from 'vee-validate/dist/locale/zh_TW';

// Vue Loading Overlay Component
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

// 價格的filters
import currencyFilter from './filters/currency';

Vue.use(VueAxios, axios)
Vue.config.productionTip = false

Vue.use(VeeValidate);//啟用驗證套件
VeeValidate.Validator.localize('zh_TW', zhTWValidate);

Vue.component('Loading',Loading);//啟用元件(全域的方式)
Vue.filter('currency',currencyFilter);

//抓取cookies
//將這段 cookie 存起來，之後在每次發送 API 時，都會將瀏覽器所儲存的 cookie 帶往後端，這樣才能知道是否 有登入
axios.defaults.withCredentials = true;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
})
//導航守衛 
//to:即將進入的目的路由 from:當前導航正要離開的路由 next:執行下一個事件，每個判斷都必須確保使用到 next() 
//next():繼續往下執行的回呼函式，你必須要呼叫他才能繼續執行。
router.beforeEach((to, from, next) => {
  //判斷要轉跳的頁面 是否需要驗證(meta.requiresAuth:我們這次記錄是否需要驗證的自訂的參數。)
    if(to.meta.requiresAuth){
      //使用 /user/check API 來檢查用戶是否 持續登入，
      //但是在 AJAX 撰寫中並沒看到帶入任何參數，
      //但其實還是有，就是帶入 cookie 去後端驗證，後端有收到這個 cookie 才知道用戶是否持續登入
      const api=`${process.env.APIPATH}/api/user/check`;
        axios.post(api).then((response) => {      
          if (response.data.success){
              next();
          }
          else{
            next({  
              path:'/login',
            })
           
          }
        });
    }else{
      
      next();
    }
    
})