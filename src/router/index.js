import Vue from 'vue'
import VueRouter from 'vue-router'
import 'bootstrap';
// import Home from '@/components/HelloWorld.vue'
import Login from '@/components/pages/Login.vue';
import Dashbord from '@/components/Dashbord.vue';
import Product from '@/components/pages/Product.vue';
import CouponCode from '@/components/pages/CouponCode.vue';
import CustomerOrder from '@/components/pages/CustomerOrders.vue';

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
            path:'/admin',
            name:'Dashbord',
            component:Dashbord,
            children:[
                {
                    path:'product',
                    name:'products',
                    component:Product,
                    meta: { requiresAuth: true }
                },
                {
                    path:'coupons',
                    name:'CouponCode',
                    component:CouponCode,
                    meta: { requiresAuth: true }
                },
            ]
       },
       {
            path:'/',
            name:'Dashbord',
            component:Dashbord,
            children:[
                {
                    name:'CustomerOrder',
                    path:'customer_order',
                    component:CustomerOrder,
                }
        ]
   }
       
    ]
})