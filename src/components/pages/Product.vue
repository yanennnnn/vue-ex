<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="text-right">
            <button class="btn mt-4 btn-primary " @click="openModal(true)">新增產品</button>
        </div>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th scope="col" width="120">分類</th>
                    <th scope="col">產品名稱</th>
                    <th scope="col" width="80">原價</th>
                    <th scope="col" width="80">售價</th>
                    <th scope="col" width="100">是否啟用</th>
                    <th scope="col" width="120">編輯</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item) in products" :key="item.id">
                    <td >{{item.category}}</td>
                    <td >{{item.title}}</td>
                    <td class="text-right " >{{ item.origin_price}}</td>
                    <td class="text-right ">{{ item.price}}</td>
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
        <!--pagination-->
        <!-- 1. v-bind:pageData 會把 pageData 這個參數的值傳過去給 pagination -->
        <!-- 2. 新增 getProducts 的 Function 來接收子元件的資料。
        當子元件觸發 emitpage 時，就會執行 getProducts 來接收傳送的值 -->
        <Pagination :pageData="pagination" @emitpage="getProducts"></Pagination>
        <!--updateModal-->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content border-0">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title" id="exampleModalLabel">
                    <span>新增產品</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                    <div class="col-sm-4">
                        <div class="form-group">
                            <label for="image">輸入圖片網址</label>
                            <input type="text" class="form-control" id="image"
                                placeholder="請輸入圖片連結" v-model="tempProduct.imageUrl">
                            </div>
                            <div class="form-group">
                            <label for="customFile">或 上傳圖片
                                <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                            </label>
                            <input type="file" id="customFile" class="form-control p-1"
                                ref="files" @change="uploadFile">
                        </div>
                        <img class="img-fluid" :src="tempProduct.imageUrl" alt="">
                        </div>
                        <div class="col-sm-8">
                            <div class="form-group">
                            <label for="title">標題</label>
                            <input type="text" class="form-control" id="title"
                                placeholder="請輸入標題" v-model="tempProduct.title">
                            </div>

                            <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="category">分類</label>
                                <input type="text" class="form-control" id="category"
                                placeholder="請輸入分類" v-model="tempProduct.category">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="price">單位</label>
                                <input type="unit" class="form-control" id="unit"
                                placeholder="請輸入單位"  v-model="tempProduct.unit">
                            </div>
                            </div>

                            <div class="form-row">
                            <div class="form-group col-md-6">
                            <label for="origin_price">原價</label>
                                <input type="number" class="form-control" id="origin_price"
                                placeholder="請輸入原價"  v-model="tempProduct.origin_price">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="price">售價</label>
                                <input type="number" class="form-control" id="price"
                                placeholder="請輸入售價"  v-model="tempProduct.price">
                            </div>
                            </div>
                            <hr>

                            <div class="form-group">
                            <label for="description">產品描述</label>
                            <textarea type="text" class="form-control" id="description"
                                placeholder="請輸入產品描述" v-model="tempProduct.description"></textarea>
                            </div>
                            <div class="form-group">
                            <label for="content">說明內容</label>
                            <textarea type="text" class="form-control" id="content"
                                placeholder="請輸入產品說明內容"  v-model="tempProduct.content"></textarea>
                            </div>
                            <div class="form-group">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox"
                                id="is_enabled" v-model="tempProduct.is_enabled" :true-value="1" :false-value="0">
                                <label class="form-check-label" for="is_enabled">
                                是否啟用
                                </label>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
                </div>
                </div>
            </div>
        </div>
        <!--delProductModel-->
        <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
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
                        是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-danger" @click="delProduct"
                        >確認刪除</button>
                    </div>
                </div>
            </div>
        </div>




    </div>
    
</template>

<script>
import $ from 'jquery'; //引入jquery
import Pagination from '../pagination';
export default {
    components:{
        Pagination
    },
    data() {
        return {
            products:[],//新增的資料存在這裡
            tempProduct:{},
            isNem:false,//判斷此商品是否為新建立或者已建立
            isLoading:false,//預設loading正常時不開啟
            status:{
                fileUploading:false//Modal內圖片上船的Loading正常時不啟動
            },
            pagination:{},// 要先預定義分頁
        }
    },
    
    methods: {
        getProducts(page = 1){// ES6 參數預設值 : 假設沒帶這參數預設就是 1 (這樣就可以不用改以前的東西了)
            // const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/products`;
             const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/products?page=${page}`;
            //所申請的APIPath
            const vm=this;
            console.log(process.env.APIPATH, process.env.CUSTOMPATH);
            vm.isLoading=true;//開啟loading
            this.$http.get(api).then((response) => {
            vm.isLoading=false;//資料抓取完關閉loading
            // console.log(response.data)
            vm.products=response.data.products;
            vm.pagination = response.data.pagination;// 把分頁資訊存到 pagination 變數
            })
        },
        openModal(isNew,item){//傳參數
            if(isNew){//為新建立
                this.temProduct={};//Modal內為空的
                this.isNew=true;//isNew為改成true
            }else{
                this.tempProduct=Object.assign({},item)
                //由於物件是傳參考，為了避免互相汙染
                //所以使用assign(被用來複製一個或多個物件自身所有可數的屬性到另一個目標物件。回傳的值為該目標物件。)
                //屬於ES6的方式，把item值放進assign內
                this.isNew=false;
                console.log(this.tempProduct);
            }
            $('#productModal').modal('show');//手動打開動態視窗。 在動態視窗實際顯示之前返回給調用者（即在shown.bs.modal 事件發生之前）。
        },
        updateProduct(){//更新商品
            let api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`;
            let httpMethod='post';
            //所申請的APIPath
            const vm=this;
            if(!vm.isNew){
                api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
                httpMethod='put';
            }
            this.axios[httpMethod](api,{data:vm.tempProduct}).then((response) => {
            
                console.log(response.data);
                if(response.data.success){ //成功，關閉模板並從新取得商品列表
                    $('#productModal').modal('hide');
                    vm.getProducts();
                }else{//失敗，關閉模板，從新取得商品列表，並告知
                    $('#productModal').modal('hide');
                    vm.getProducts();
                    console.log('新增失敗');
                }
            
            })
        },
        deleteModal(item){ //刪除的Modal
            this.tempProduct=item;
            $('#delProductModal').modal('show');

        },
        delProduct(){ //刪除產品
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
            console.log(process.env.APIPATH, process.env.CUSTOMPATH);
            this.$http.delete(api).then(response => {
                console.log(response.data);
                if (response.data.success) {
                    $("#delProductModal").modal("hide");
                    vm.getProducts();
                } else {
                    $("#delProductModal").modal("hide");
                    vm.getProducts();
                    console.log("刪除失敗");
                }
             });
        },
        uploadFile(){//上傳圖片檔案(使用上傳表單方式)
            console.log(this);
            const uploadFile=this.$refs.files.files[0];//取得陣列(照片內容)
            // const id=this.$refs.files.id;
            const vm=this;
            const formData=new FormData();//模擬表單送出
            formData.append('file-to-upload',uploadFile);
            const url=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`;
            vm.status.fileUploading=true;
            this.$http.post(url,formData,{
                headers: {'Content-Type': 'multipart/form-data',},
                
            }).then((response)=>{
                vm.status.fileUploading=false;
                console.log(response.data);
                if (response.data.success) {
                    // vm.tempProduct.imageUrl = response.data.imageUrl;
                    // console.log(vm.tempProduct);
                    vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl);
                     
                }else{
                    this.$bus.$emit('messsage:push', response.data.message, 'danger');
                }
                
            });
            // if(uploadFile==null){
            //     vm.status.fileUploading=false;
            //     // document.getElementById(id).value='';
            // }
        },
    },
    created() {
            this.getProducts();
    },
}
</script>