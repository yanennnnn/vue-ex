<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  // created(){
  //   //API的伺服器路徑
  //   const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`;
  //   //所申請的APIPath
  //   console.log(process.env.APIPATH, process.env.CUSTOMPATH);
  //   this.axios.get(api).then((response) => {
      
  //      console.log(response.data)
  //   })
  // },
  // components: {
  //   HelloWorld
  // }
}
</script>

<style lang="scss">
  @import "./assets/all"
</style>
