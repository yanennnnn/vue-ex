<template>
    <div>
        <!-- loading效果 -->
        <loading :active.sync="isLoading"></loading> 
        <div class="row mt-4">
            <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
                <div class="card border-0 shadow-sm">
                    <div style="height: 150px; background-size: cover; background-position: center"
                        :style="{backgroundImage: `url(${item.imageUrl})`}">
                    </div>
                    <div class="card-body">
                        <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
                        <h5 class="card-title">
                        <a href="#" class="text-dark">{{ item.title }}</a>
                        </h5>
                        <p class="card-text">{{ item.content }}</p>
                        <div class="d-flex justify-content-between align-items-baseline">
                        <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
                        <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
                        <div class="h5" v-if="item.price">現在只要 {{ item.price }} 元</div>
                        </div>
                    </div>
                    <div class="card-footer d-flex">
                        <button type="button" class="btn btn-outline-secondary btn-sm" @click.prevent="getProduct(item.id)">
                        <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                        查看更多
                        </button>
                        <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addtoCart(item.id)">
                        <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                        加到購物車
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <div class="my-5 row justify-content-center">
            <div class="my-5 row justify-content-center">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">品名</th>
                            <th scope="col" width="80">數量</th>
                            <th scope="col" width="80">單價</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in cart.carts" :key="item.id" >
                            <td  class="align-middle"><button class="btn btn-outline-danger btn-sm " @click="removeCartItem(item.id)"><i class="far fa-trash-alt"></i></button></td>
                            <td>{{item.product.title}}</td>
                            <td class="text-right">{{item.qty}}/{{ item.product.unit }}</td>
                            <td class="text-right">{{item.final_total}}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" class="text-right">總計</td>
                            <td class="text-right">{{ cart.total }}</td>
                        </tr>
                         <tr v-if="cart.final_total!==cart.total">
                            <td colspan="3" class="text-right text-success">折扣價</td>
                            <td class="text-right text-success">{{ cart.final_total }}</td>
                        </tr>
                    </tfoot>
                </table>
                <div class="input-group mb-3 input-group-sm">
                    <input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼">
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">
                        套用優惠碼
                        </button>
                    </div>
                 </div>
            </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <img :src="product.imageUrl" class="img-fluid" alt="">
                        <blockquote class="blockquote mt-3">
                        <p class="mb-0">{{ product.content }}</p>
                        <footer class="blockquote-footer text-right">{{ product.description }}</footer>
                        </blockquote>
                        <div class="d-flex justify-content-between align-items-baseline">
                        <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
                        <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
                        <div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
                        </div>
                        <select name="" class="form-control mt-3" v-model="product.num">
                        <option :value="num" v-for="num in 10" :key="num"> <!--自行選定數字-->
                            選購 {{num}} {{product.unit}}
                        </option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <div class="text-muted text-nowrap mr-3">
                        小計 <strong>{{ product.num * product.price }}</strong> 元
                        </div>
                        <button type="button" class="btn btn-primary"
                            @click="addtoCart(product.id, product.num)">
                            <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
                            加到購物車
                        </button>
                    </div>
                </div>
            </div> 
        </div>
    </div>
    
</template>

<script>
import $ from 'jquery';
export default {
  data() {
    return {
      products: [],//資料存放處
      isLoading: false,
      product:{},//單筆資料存放處
      status: {
        loadingItem: '',
      },
      cart: {}, //購物車資料存放處
      coupon_code:''//優惠碼存放處
    };
  },
  methods: {
    getProducts() {
      const vm = this;
       //用戶端取得路徑
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`;
      vm.isLoading = true;
      this.$http.get(url).then((response) => {
        vm.products = response.data.products;//資料存在products
        console.log(response);
        vm.isLoading = false;
      });
    },
    getProduct(id){//單筆資料
        const vm = this;
       //用戶端取得路徑
        const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
        vm.status.loadingItem = id;
        this.$http.get(url).then((response) => {
        vm.product = response.data.product;//資料存在單筆product
        $('#productModal').modal('show');
        console.log(response);
         vm.status.loadingItem = '';
      });
    },
    addtoCart(id,qty=1){//產品ID和數量預設為1(如果沒有帶入其他數字會用預設值)
        const vm = this;
       //用戶端取得路徑
        const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
        vm.status.loadingItem = id;
        const cart={ //資料結構建立
            product_id:id,
            qty//自動帶入變數直
        };
        this.$http.post(url,{data:cart}).then((response) => {//讀取改post
            console.log(response);
            $('#productModal').modal('hide');
            vm.getCart();
            vm.status.loadingItem = '';
        });
    },
    getCart(){//取得購物車內容
        const vm = this;
       //用戶端取得路徑
        const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
        vm.isLoading = true;
        this.$http.get(url).then((response) => {
            vm.cart = response.data.data;
            console.log(response);
            vm.isLoading = false;
        });
    },
    removeCartItem(id){
        const vm = this;
       //用戶端取得路徑
        const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
        vm.isLoading = true;
        this.$http.delete(url).then(() => {
             vm.getCart();
            vm.isLoading = false;
           
        });
    },
    addCouponCode(){//優惠碼確認
        const vm = this;
        const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
        const coupon = {
            code: vm.coupon_code,
        };
        vm.isLoading = true;
        this.$http.post(url,{data:coupon}).then((response) => {
            console.log(response);
            vm.getCart();//重整購物車
            vm.isLoading = false;
           
        });
    }
  },
  created() {
    this.getProducts();
    this.getCart();
  },
}
</script>