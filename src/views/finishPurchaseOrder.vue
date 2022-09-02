<template>
    <Layout bodyCls="f-column" style="height: calc(100vh - 52px)" :border="false">
        <LayoutPanel region="north" :border="false">
            <Panel :bodyStyle="{padding:'8px'}" :border="false">
                <LinkButton iconCls="icon-undo" :disabled="!obj.id" :plain="true" @click="cancelSend">撤销发货</LinkButton>
                <div class="pull-right">
                    <filterList @filterLoad="filter"></filterList>
                </div>
            </Panel>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%" bodyCls="f-column" :border="false">
            <DataGrid :data="data" style="width:100%;height:250px" :border="false"
                      class="f-full"
                      :columnResizing="true"
                      :lazy="true"
                      :total="total"
                      selectionMode="single"
                      :loading="loading"
                      @rowDblClick="edit()"
                      @selectionChange="selectObj($event)"
                      :pageNumber="pageNumber"
                      :pageSize="pageSize"
                      @pageChange="onPageChange($event)"
                      :pagination="true"
                      :pagePosition="'bottom'">
                <GridColumn align="center" cellCss="datagrid-td-rownumber" width="30">
                    <template slot="body" slot-scope="scope">
                        {{ scope.rowIndex + 1 }}
                    </template>
                </GridColumn>
                <GridColumn field='orderNumber' title='单据编号' width="140" align="center"></GridColumn>
                <GridColumn field='commodityName' title='商品名称' width="120" align="left"></GridColumn>
                <GridColumn field='wareNum' title='数量' width="50" align="center"></GridColumn>
                <GridColumn field="purchasePrice" title='单价' width="80" align="right">
                    <template slot="body" slot-scope="scope">
                        {{ toMoney(scope.row.purchasePrice, '') }}
                    </template>
                </GridColumn>
                <GridColumn title='合计金额' width="80" align="right">
                    <template slot="body" slot-scope="scope">
                        {{ toMoney(scope.row.purchasePrice * scope.row.wareNum, '') }}
                    </template>
                </GridColumn>
                <GridColumn field='shippingTime' title='递交时间' width="120" align="center"></GridColumn>
                <GridColumn field='consigneeName' title='收货人' width="120" align="center"></GridColumn>
                <GridColumn field='phone' title='手机号码' width="120" align="center"></GridColumn>
                <GridColumn field='address' title='收货地址' width="120" align="left"></GridColumn>
                <GridColumn field='sendType' title='送货方式' width="120" align="center">
                    <template slot="body" slot-scope="scope">
                        {{ scope.row.sendType ? "快递" : "送货" }}
                    </template>
                </GridColumn>
                <GridColumn field='deliveryPhone' title='送货电话' width="120" align="center">
                    <template slot="body" slot-scope="scope">
                        {{ scope.row.sendType ? "" : scope.row.deliveryPhone }}
                    </template>
                </GridColumn>
                <GridColumn field='logisticsCompanyName' title='物流公司' width="120" align="center">
                    <template slot="body" slot-scope="scope">
                        {{ scope.row.sendType ? scope.row.logisticsCompanyName : "" }}
                    </template>
                </GridColumn>
                <GridColumn field='logisticsNumber' title='物流单号' width="120" align="center">
                    <template slot="body" slot-scope="scope">
                        {{ scope.row.sendType ? scope.row.logisticsNumber : "" }}
                    </template>
                </GridColumn>
                <GridColumn field='shippingTime' title='发货时间' width="120" align="center"></GridColumn>
                <GridColumn field='estimatedArrivalDate' title='预计到达日期' width="120" align="center"></GridColumn>
            </DataGrid>
        </LayoutPanel>
    </Layout>
</template>

<script>
import filterList from '@/components/filterList.vue';

export default {
    name: "app",
    data() {
        return {
            total: 0,
            pageSize: 20,
            pageNumber: 1,
            data: [],
            loading: false,
            obj: {},
            timeout: null,
            filterString: '',
            allSelected: false,
            deliveryStatus: false
        }
    },
    components: {
        filterList
    },
    created: function () {
        this.loadPage(this.pageNumber, this.pageSize);
    },
    methods: {
        onPageChange(event) {
            this.loadPage(event.pageNumber, event.pageSize);
        },
        loadPage(pageNumber, pageSize) {
            this.loading = true;
            let vm = this;
            this.$root.getData("orderFormItem/getPurchaseOrderQueryList", {
                limit: pageSize,
                offset: pageSize * (pageNumber - 1),
                sort: "id",
                direction: "desc",
                filterString: this.filterString,
                deliveryStatus: true
            }, function (data) {
                vm.total = data.total;
                vm.data = [];
                data.children.forEach(function (e) {
                    vm.$set(e, 'selected', false);
                    vm.data.push(e);
                })
                vm.allSelected = false;
                vm.loading = false;
            })
        },
        selectObj(obj) {
            this.obj = this.clone(obj);
        },
        edit() {
            if (!this.obj.deliveryStatus) {
                this.$refs.sendDlg.open();
            }
        },
        cancelSend(){
            let vm = this;
            this.confirm("确认吗?", function () {
                vm.getData("orderFormItem/cancelSend", {id:vm.obj.id}, function (data) {
                    vm.loadPage(1,vm.pageSize);
                })
            })
        },
        filter(filterString) {
            this.filterString = filterString;
            this.loadPage(this.pageNumber, this.pageSize);
        },
    }
}
</script>

<style scoped>
.b-red {
    border: 1px solid #F44336
    /*background-color: #ff9992*/
}

.c-red {
    color: red;
}

.th {
    border: 1px solid #ddd;
    padding: 6px;
}

.td {
    border: 1px solid #ddd;
    padding: 6px;
}
</style>
