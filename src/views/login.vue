<template>
    <div class="row">
        <div class="col-md-4 col-md-offset-4">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">用户登录</h3>
                </div>
                <div class="panel-body">
                    <label>登录名</label>
                    <input type="text" class="form-control" v-model="loginname">
                    <label>密码</label>
                    <input type="password" class="form-control" v-model="password">
                    <button class="btn btn-primary m-t-15" @click="login">登录</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "app",
    data() {
        return {
            loginname: undefined,
            password: undefined
        }
    },
    created: function () {
        if (!this.$root.userObj) {
            this.$router.push('login');
        }
    },
    methods: {
        login() {
            let vm = this;
            this.getData("supplierUser/supplierLogin", {
                loginname: this.loginname, password: this.password
            }, function (data) {
                sessionStorage.token = data.token;
                sessionStorage.userObj = JSON.stringify(data.user);
                vm.$router.push('index');
            })
        }
    }
}
</script>

<style scoped>

</style>
