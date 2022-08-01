<template>
    <div>
        <div v-for="menu in menuList" @click="goPage(menu)" class="col-2" style="height: 123px" v-show="!menu.hide">
            <a style="text-decoration:none;cursor:pointer" @click="goPage(menu)">
                <img :src="menu.iconBase64" style="width:50%;max-width: 60px"><br>
                <span class="c-black f-14">{{ menu.text }}</span>
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: "app",
    data() {
        return {
            menuList: [],
            filterMenu: ''
        }
    },
    created() {
        this.selectMenu(this.$root.menu);
    },
    methods: {
        selectMenu(menu) {
            let vm = this;
            this.menuList = [];
            if (menu.nodes) {
                menu.nodes.forEach(function (n) {
                    let icon = '';
                    if (n.icon) {
                        icon = require('../assets/images/' + n.icon);
                    }
                    vm.menuList.push({id: n.id, text: n.text, url: n.url, iconBase64: icon, hide: false});
                })
            }
            if (menu.url) {
                this.$router.push(menu.url);
            }
            this.$root.tag = menu.id;
        },
        goPage(menu) {
            this.$root.twomenu = menu;
            sessionStorage.twomenu = JSON.stringify(menu);
            this.$router.push(menu.url);
        }
    },
    watch: {
        filterMenu: {
            handler() {
                let vm = this;
                if (this.timeout) clearTimeout(this.timeout);
                this.timeout = setTimeout(function () {
                    vm.menuList.forEach(function (e) {
                        e.hide = e.text.indexOf(vm.filterMenu) < 0;
                    })
                }, 500);
            }
        }
    },
}
</script>

<style scoped>
.menu-icon:hover {
    background-color: rgba(0, 0, 0, 0.075);
}

.col-2 {
    float: left;
    width: 16.666666666%;
    padding: 20px;
    text-align: center;
}
</style>
