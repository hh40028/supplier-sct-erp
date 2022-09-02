<template>
    <Layout bodyCls="f-column" style="height: calc(100vh - 52px)" :border="false">
        <LayoutPanel region="north" :border="false">
            <Panel :bodyStyle="{padding:'8px'}" :border="false">
                <LinkButton iconCls="icon-edit" :disabled="!obj.id" :plain="true" @click="editObj">编辑</LinkButton>
                <LinkButton iconCls="icon-ok" :disabled="deliveryStatus" :plain="true" @click="confirmSend">确认发货</LinkButton>
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
                <GridColumn field="status" :width="40" align="center">
                    <template slot="header" slot-scope="scope">
                        <input type="checkbox" v-model="allSelected"
                               @click="all">
                    </template>
                    <template slot="body" slot-scope="scope">
                        <input type="checkbox" v-model="scope.row.selected"
                               @click="scope.row.selected=!scope.row.selected">
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
                        {{ toMoney(scope.row.cost * scope.row.wareNum, '') }}
                    </template>
                </GridColumn>
                <GridColumn field='submitTime' title='递交时间' width="120" align="center"></GridColumn>
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
                <GridColumn field='deliveryTime' title='发货时间' width="120" align="center"></GridColumn>
                <GridColumn field='estimatedArrivalDate' title='预计到达日期' width="120" align="center"></GridColumn>
            </DataGrid>
        </LayoutPanel>
        <Dialog ref="sendDlg" closed
                :title="'发货信息录入'"
                :dialogStyle="{width:'600px'}"
                bodyCls="f-column"
                :draggable="true"
                :resizable="true"
                :modal="true">
            <div class="f-full">
                <table class="table" style="width:100%">
                    <tbody>
                    <tr>
                        <td class="text-right td" style="width:30%">商品名称</td>
                        <td class="text-left td" colspan="3" style="width:70%">{{ obj.commodityName }}</td>
                    </tr>
                    <tr>
                        <td class="text-right td">商品数量</td>
                        <td class="text-left td">{{ obj.wareNum }}</td>
                    </tr>
                    <tr>
                        <td class="text-right td">商品单价(元)</td>
                        <td class="text-left td">
                            <input type="text" class="form-control" v-model="obj.purchasePrice">
                        </td>
                    </tr>
                    <tr>
                        <td class="text-right td">递交时间</td>
                        <td class="text-left td">{{ obj.createTime }}</td>
                    </tr>
                    <tr>
                        <td class="text-right td">收货人</td>
                        <td class="text-left td">{{ obj.consigneeName }}</td>
                    </tr>
                    <tr>
                        <td class="text-right td">手机号码</td>
                        <td class="text-left td">{{ obj.phone }}</td>
                    </tr>
                    <tr>
                        <td class="text-right td">收货地址</td>
                        <td class="text-left td">{{ obj.address }}</td>
                    </tr>
                    </tbody>
                </table>

                <div class="col-12 p-t-15 p-l-15 p-r-15">
                    <label>送货方式</label><br>
                    <input type="checkbox" v-model="obj.sendType" id="aaa">
                    <label for="aaa">{{ obj.sendType ? "快递" : "送货" }}</label>
                </div>
                <div v-if="obj.sendType" class="col-12 p-t-15 p-l-15 p-r-15">
                    <label>物流公司</label><br>
                    <input type="text" v-model="obj.logisticsCompanyName" @click="openLogistics" class="form-control">
                </div>
                <div v-if="obj.sendType" class="col-12 p-t-15 p-l-15 p-r-15">
                    <label>物流单号</label><br>
                    <input type="text" v-model="obj.logisticsNumber" class="form-control">
                </div>
                <div v-if="!obj.sendType" class="col-12 p-t-15 p-l-15 p-r-15">
                    <label>送货电话</label><br>
                    <input type="text" v-model="obj.deliveryPhone" class="form-control">
                </div>
                <div class="col-12 p-t-15 p-l-15 p-r-15" style="margin-bottom: 30px">
                    <label>预计到达日期</label><br>
                    <input type="date" v-model="obj.estimatedArrivalDate" class="form-control">
                </div>
            </div>
            <div class="dialog-button">
                <LinkButton style="width:80px" @click="save">保存</LinkButton>
                <LinkButton style="width:80px" @click="$refs.sendDlg.close()">关闭</LinkButton>
            </div>
        </Dialog>
        <selectLogisticscompany ref="selectLogisticscompanyCom" @selectLogistics="selectLogistics"></selectLogisticscompany>
    </Layout>
</template>

<script>
import filterList from '@/components/filterList.vue';
import selectLogisticscompany from '@/components/selectLogisticscompany.vue';

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
        filterList, selectLogisticscompany
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
                deliveryStatus: false
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
        editObj() {
            this.$refs.sendDlg.open();
        },
        filter(filterString) {
            this.filterString = filterString;
            this.loadPage(this.pageNumber, this.pageSize);
        },
        save() {
            let vm = this;
            this.getData("orderFormItem/supplierSave", this.obj, function (data) {
                vm.loadPage(vm.pageNumber, vm.pageSize);
                vm.$refs.sendDlg.close();
            })
        },
        all() {
            let vm = this;
            this.allSelected = !this.allSelected;
            this.data.forEach(function (e) {
                e.selected = vm.allSelected;
            })
        },
        confirmSend() {
            let vm = this;
            let arr = [];
            this.data.forEach(function (e) {
                if (e.selected) {
                    arr.push(e);
                }
            })
            if (arr.length > 0) {
                this.confirm('已发货,确认吗?', function () {
                    vm.getData("orderFormItem/supplierConfirmSend", {rows: JSON.stringify(arr)}, function (data) {
                        vm.msg('操作成功');
                        vm.loadPage(vm.pageNumber, vm.pageSize);
                    })
                })
            } else {
                this.alert('请勾选发货记录');
            }
        },
        changeStatus() {
            this.loadPage(this.pageNumber, this.pageSize);
        },
        selectLogistics(obj) {
            this.$set(this.obj, 'logisticsId', obj.carriers_id);
            this.$set(this.obj, 'logisticsCompanyName', obj.carriers_name);
            this.$refs.selectLogisticscompanyCom.close();
        },
        openLogistics() {
            this.$refs.selectLogisticscompanyCom.open();
        }
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
