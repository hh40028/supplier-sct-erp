<template>
    <Layout bodyCls="f-column" :border="false">
        <LayoutPanel region="center" style="height:100%" :border="false">
        </LayoutPanel>
    </Layout>
</template>


<script>
export default {
    name: "app",
    data() {
        return {
            data: []
        }
    },
    created: function () {
        this.load();
    },
    methods: {
        load() {
        }
    }
}
</script>

<style scoped>
</style>
