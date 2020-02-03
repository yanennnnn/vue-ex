<template>
    <div>
    <table class="table">
        <thead>
            <tr>
                <th scope="col" width="100">購買時間</th>
                <th scope="col" >Email</th>
                <th scope="col">購買款項</th>
                <th scope="col" width="100">應付金額</th>
                <th scope="col" width="100">是否匯款</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in orders" :key="item.id">
               <td>{{item.create_at | date}}</td>
               <td>{{item.user.email}}</td>
               <td>
                   <ul class="list-unstyled">
                       <li v-for="(product,i) in item.products" :key="i">{{product.product.title}}:{{product.qty}}/{{product.product.unit}}</li>
                   </ul>
                </td>
                <td class="text-right">{{item.total | currency}}</td>
                <td >
                    <span v-if="item.is_paid" class="text-success">已付款</span>
                    <span v-else >尚未付款</span>
                </td>
            </tr>
        </tbody>
    </table>
    <!--pagination-->
        <!-- 1. v-bind:pageData 會把 pageData 這個參數的值傳過去給 pagination -->
        <!-- 2. 新增 getOrder 的 Function 來接收子元件的資料。
        當子元件觸發 emitpage 時，就會執行 getOrder 來接收傳送的值 -->
        <Pagination :pageData="pagination" @emitpage="getOrder"></Pagination>
    </div>
</template>

<script>
import Pagination from '../pagination';
export default {
    components:{
        Pagination
    },
    data(){
        return{
            orders:[],
            pagination:{},// 要先預定義分頁
        }
    },
    methods: {
        getOrder(){
            const vm = this;
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/orders`;
            this.$http.get(url).then((response)=> {
                console.log(response.data);
                vm.orders=response.data.orders;
                vm.pagination = response.data.pagination;// 把分頁資訊存到 pagination 變數
            });
        }
    },
    created() {
        this.getOrder();
    },
}
</script>