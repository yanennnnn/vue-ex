import Vue from 'vue'
import VueRouter from 'vue-router'
import 'bootstrap';
// import Home from '@/components/HelloWorld.vue'
import Login from '@/components/pages/Login.vue';
import Admin from '@/components/Dashbord.vue';
import Product from '@/components/pages/Product.vue';
// import Login from '@/components/pages/Login'

Vue.use(VueRouter);

export default new VueRouter({
   routes:[
       {
           path:'*',
           redirect:'login'//假如不是所設定的路由則從新導向到login
       },
    //    {
    //        name:'首頁',//元件呈現的名稱
    //        path:'/',//虛擬路徑
    //        component:Home,//對應的元件
    //        meta: { requiresAuth: true }//記錄 是否需要驗證 自訂的參數。
    //    },
       {
           name:'登入',
           path:'/login',
           component:Login,
       },
       {
            name:'admin',
            path:'/admin',
            component:Admin,
            children:[
                {
                    name:'products',
                    path:'product',
                    component:Product,
                    meta: { requiresAuth: true }
                }
            ]
       }
       
    ]
})