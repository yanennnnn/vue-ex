<template>
  <div >
    <Navbar/>
    <Alert></Alert>
    <div class="container-fluid">
      <Sidebar></Sidebar>
      <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
        <router-view/>
      </main>
    </div>
  </div>
</template>


<script>
import Sidebar from './Sidebar.vue';
import Navbar from './Navbar.vue';
import Alert from './AlertMessage';
export default {
  components:{
    Sidebar,
    Navbar,
    Alert,
  }
}
</script>
