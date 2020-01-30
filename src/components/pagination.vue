<template>
    <!-- template 裡面的 pagination，是分頁內容
    如果要讓其他元件也有分頁效果，要另外使用共用變數，這裡為 pageData
    所以要把原先貼過來的 pagination 改為 pageData
    如 pagination.has_pre、pagination.current_page - 1、pagination.total_pages 等等...-->
    <nav aria-label="Page navigation example">
    <ul class="pagination">
        <!-- 若 pagination.has_pre 是 false 就加上 disabled -->
        <li class="page-item" :class="{'disabled': !pageData.has_pre }">
        <a class="page-link" href="#" aria-label="Previous" @click.prevent="updatePage(pageData.current_page - 1)">
            <span aria-hidden="true">&laquo;</span>
        </a>
        </li>
        <!-- 若 pagination.current_page === page 就加上 active -->
        <li class="page-item" v-for="page in pageData.total_pages" :key="page"
          :class="{'active': pageData.current_page === page}">
          <!-- 點擊切換至指定的 page 數 -->
            <a class="page-link" href="#" @click.prevent="updatePage(page)">{{page}}</a>
        </li>
        <!-- 若 pagination.has_next 是 false 就加上 disabled -->
        <li class="page-item" :class="{'disabled': !pageData.has_next }">
        <a class="page-link" href="#" aria-label="Next" @click.prevent="updatePage(pageData.current_page + 1)">
            <span aria-hidden="true">&raquo;</span>
        </a>
        </li>
    </ul>
    </nav>
</template>
<script>

export default {
   name: "Product",
  // 接受外部傳入之資料 (pagination)
  // 利用 props 將資料傳給 Components 使用 (父元件 → 子元件)
   props:{
        pageData:{
        type: Object,
     }
   },
   //因為要讓其他元件也可以套分頁
   //所以要使用共用變數取得數量，可取得像是產品或是訂單數量，這裡取名為 updatePage
   //在 data 下面新增 methods，又因為 Products.vue 裡的 api 需傳遞參數所以裡面加入 page
   //使用 emit 由內到外傳遞資料，使用變數為 emitpage，後面接上參數 page
   // 利用 emit 將 Components 的資料回傳 (子元件 → 父元件)
   //                事件名稱    , 傳出去的參數
    methods: {
        updatePage(page){
            this.$emit('emitpage',page)
        }   
    },    
}
</script>
