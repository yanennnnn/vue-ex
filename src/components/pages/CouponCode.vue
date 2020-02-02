<template>
    <div>
        <!-- <loading :active.sync="isLoading"></loading> -->
        <div class="text-right">
            <button class="btn mt-4 btn-primary " @click="openModal(true)">新增產品</button>
        </div>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th scope="col" width="120">名稱</th>
                    <th scope="col">優惠碼</th>
                    <th scope="col" width="130">到期日</th>
                    <th scope="col" width="80">折扣</th>
                    <th scope="col" width="100">是否啟用</th>
                    <th scope="col" width="120">編輯</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item) in couponcodes" :key="item.id">
                    <td >{{item.title}}</td>
                    <td >{{item.code}}</td>
                    <td >{{item.due_date}}</td>
                    <td class="text-right">{{ item.percent}}</td>
                    <td>
                        <span v-if="item.is_enabled" class="text-success">啟用</span>
                        <span v-else >未啟用</span>
                    </td>
                    <td class="d-flex">
                        <button class="btn btn-outline-primary btn-sm"  @click="openModal(false,item)">編輯</button>
                        <button class="btn btn-outline-danger btn-sm " @click="deleteModal(item)">刪除</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- pagination -->
        <!-- 1. v-bind:pageData 會把 pageData 這個參數的值傳過去給 pagination -->
        <!-- 2. 新增 getProducts 的 Function 來接收子元件的資料。
        當子元件觸發 emitpage 時，就會執行 getProducts 來接收傳送的值 -->
        <!-- <Pagination :pageData="pagination" @emitpage="getProducts"></Pagination> -->

        <!--updateModal-->
        <div class="modal fade" id="CouponcodeModal" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                        <span>新增優惠碼</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col">
                                <div class="form-group">
                                    <label for="title">標題</label>
                                    <input type="text" class="form-control" id="title"
                                        placeholder="請輸入標題" v-model="temCouponcode.title">
                                </div>
                                <div class="form-group ">
                                    <label for="code">優惠碼</label>
                                    <input type="text" class="form-control" id="code"
                                        placeholder="請輸入優惠碼" v-model="temCouponcode.code">
                                </div>
                                <div class="form-group ">
                                    <label for="date">到期日</label>
                                    <input type="date" class="form-control" id="date"
                                        placeholder="請輸入到期日"  v-model="temCouponcode.due_date">
                                </div>

                                <div class="form-group">
                                    <label for="percent">折扣百分比</label>
                                    <input type="num" class="form-control" id="percent"
                                        placeholder="請輸入折扣百分比"  v-model="temCouponcode.percent">
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox"
                                        id="is_enabled" v-model="temCouponcode.is_enabled" :true-value="1" :false-value="0">
                                    <label class="form-check-label" for="is_enabled">
                                        是否啟用
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" @click="updateCouponcode">確認</button>
                    </div>
                </div>
            </div>
        </div>
        <!--delCouponcodeModel-->
        <div class="modal fade" id="delCouponcodeModal" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                        <span>刪除產品</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        是否刪除 <strong class="text-danger">{{ temCouponcode.title }}</strong> 商品(刪除後將無法恢復)。
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-danger" @click="delCouponcode"
                        >確認刪除</button>
                    </div>
                </div>
            </div>
        </div>




    </div>
    
</template>
<script>
import $ from 'jquery'; //引入jquery
export default {
    data(){
        return{
            couponcodes:[],
            temCouponcode:{},
            isNew:false,
        }
    },
    methods: {
        getCouponCodes(){
            const vm=this;
            const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons`;
            this.$http.get(api).then((response) => {
            // vm.isLoading=false;//資料抓取完關閉loading
            console.log(response.data);
            vm.couponcodes=response.data.coupons;
            // console.log(response.data.coupons);
            // vm.pagination = response.data.pagination;// 把分頁資訊存到 pagination 變數
            })
        },
        openModal(isNew,item){//傳參數
            if(isNew){//為新建立
                this.temCouponcode={};//Modal內為空的
                this.isNew=true;//isNew為改成true
            }else{
                this.temCouponcode=Object.assign({},item)
                //由於物件是傳參考，為了避免互相汙染
                //所以使用assign(被用來複製一個或多個物件自身所有可數的屬性到另一個目標物件。回傳的值為該目標物件。)
                //屬於ES6的方式，把item值放進assign內
                this.isNew=false;
                console.log(this.temCouponcode);
            }
            $('#CouponcodeModal').modal('show');//手動打開動態視窗。 在動態視窗實際顯示之前返回給調用者（即在shown.bs.modal 事件發生之前）。
        },
        updateCouponcode(){
            const vm=this;
            let api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
            let httpMethod='post';
            if(!vm.isNew){
                api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.temCouponcode.id}`;
                httpMethod='put';
            }
            this.axios[httpMethod](api,{data:vm.temCouponcode}).then((response) => {
                if(response.data.success){ //成功，關閉模板並從新取得商品列表
                    $('#CouponcodeModal').modal('hide');
                    vm.getCouponCodes();
                }else{//失敗，關閉模板，從新取得商品列表，並告知
                    $('#CouponcodeModal').modal('hide');
                    vm.getCouponCodes();
                    console.log('新增失敗');
                }
            
            })
        },
        deleteModal(item){ //刪除的Modal
            this.temCouponcode=item;
            $('#delCouponcodeModal').modal('show');

        },
        delCouponcode(){ //刪除優惠碼
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.temCouponcode.id}`;
            console.log(process.env.APIPATH, process.env.CUSTOMPATH);
            this.$http.delete(api).then(response => {
                console.log(response.data);
                if (response.data.success) {
                    $("#delCouponcodeModal").modal("hide");
                    vm.getCouponCodes();
                } else {
                    $("#delCouponcodeModal").modal("hide");
                    vm.getCouponCodes();
                    console.log("刪除失敗");
                }
             });
        },
    },
    created() {
        this.getCouponCodes();
    },
}
</script>
