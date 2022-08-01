<template>
    <div>
        <div v-if="filterString" class="clear-icon sz" @click="filterString=''">×</div>
        <input type="text" v-model="filterString" :class="{'c-red':filterString}" onclick="select()"
               class="form-control p-r-20" :placeholder="placeholder">
    </div>
</template>

<script>
export default {
    props: {
        placeholder: {
            type: String,
            default: '过滤...'
        }
    },
    name: "app",
    data() {
        return {
            filterString: ''
        }
    },
    created: function () {
    },
    methods: {
        load: function () {
            this.$emit('filterLoad', this.filterString);
        }
    },
    watch: {
        filterString: {
            handler() {
                let vm = this;
                if (this.timeout) clearTimeout(this.timeout);
                this.timeout = setTimeout(function () {
                    vm.load();
                }, 500);
            }
        }
    },
}
</script>

<style scoped>
.clear-icon{
    position: absolute;
    top:15px;
    right:15px;
    z-index: 999999999;
    font-size: 16px;
    cursor:pointer
}
</style>
