<template>
    <div>
        <Dialog bodyCls="f-column" ref="selectLogisticsDlg" closed
                :title="'选择物流公司'"
                :draggable="true"
                :resizable="true"
                :dialogStyle="{width:'400px',height:'500px'}"
                :modal="true">
            <Layout bodyCls="f-column" style="height: calc(100vh - 52px)" :border="false">
                <LayoutPanel region="north" :border="false">
                    <div class="col-6 p-5">
                    </div>
                    <div class="col-6 p-5">
                        <TextBox style="width:100%;height:30px" v-model="filterString" @input="filterList" placeholder="过滤...">
                            <Addon align="right">
                                <span class="textbox-icon icon-clear" @click="filterString=''" v-if="filterString"></span>
                            </Addon>
                        </TextBox>
                    </div>
                </LayoutPanel>
                <LayoutPanel region="center" style="height:100%" bodyCls="f-column" :border="false">
                    <DataGrid class="f-full" :border="false"
                              selectionMode="single"
                              :data="showData"
                              @selectionChange="selectRow($event)"
                              style="width:100%;height:100%">
                        <GridColumn field='carriers_name' title='物流公司名称' width="120" align="left"></GridColumn>
                    </DataGrid>
                </LayoutPanel>
            </Layout>
        </Dialog>
    </div>
</template>

<script>
export default {
    name: "app",
    data() {
        return {
            list: [],
            showData: [],
            filterString: ''
        }
    },
    created: function () {
        this.load();
    },
    methods: {
        load: function () {
            let vm = this;
            this.$root.getData("logisticsCompany/getList", {tag:'京东'}, function (data) {
                data.forEach(function (e) {
                    vm.list.push(e);
                    vm.showData.push(e);
                })
            })
        },
        open() {
            this.$refs.selectLogisticsDlg.open();
            if (!this.list.length) {
                this.load();
            }
        },
        close() {
            this.$refs.selectLogisticsDlg.close();
        },
        selectRow(obj) {
            this.$emit('selectLogistics', obj);
        },
        filterList() {
            let vm = this;
            this.showData = [];
            if (this.filterString) {
                this.list.forEach(function (e) {
                    if (
                        e.name.indexOf(vm.filterString) >= 0
                    ) {
                        vm.showData.push(e);
                    }
                })
            } else {
                this.list.forEach(function (e) {
                    vm.showData.push(e);
                })
            }
        }
    }
}
</script>

<style scoped>

</style>
