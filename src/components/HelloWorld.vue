<template>
  <div >
    <a href="#" @click.prevent="signout">登出</a>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  // data () {
  //   return {

  //   },
  // }
  methods: {
    signout(){
      const api=`${process.env.APIPATH}/logout`;
      this.axios.post(api).then((response) => {
      const vm=this;
         console.log(response.data)
         if (response.data.success){
             vm.$router.push('/login');
         }

       });
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--scoped:樣式只能套用在這裡而已，其他無法使用-->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
