<template>
    <Layout bodyCls="f-column" style="height: calc(100vh - 52px)" :border="false">
        <LayoutPanel region="north" :border="false">
            <Panel :bodyStyle="{padding:'8px'}" :border="false">
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
                <GridColumn :expander="true" width="30"></GridColumn>
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
                <GridColumn field='number' title='单据编号' width="140" align="center"></GridColumn>
                <GridColumn field='commodityName' title='商品名称' width="120" align="left"></GridColumn>
                <GridColumn field='wareNum' title='数量' width="50" align="center"></GridColumn>
                <GridColumn field="cost" title='单价' width="80" align="right">
                    <template slot="body" slot-scope="scope">
                        {{toMoney(scope.row.cost,'')}}
                    </template>
                </GridColumn>
                <GridColumn title='合计金额' width="80" align="right">
                    <template slot="body" slot-scope="scope">
                        {{toMoney(scope.row.cost*scope.row.wareNum,'')}}
                    </template>
                </GridColumn>
                <GridColumn field='createTime' title='递交时间' width="120" align="center"></GridColumn>
                <GridColumn field='consigneeName' title='收货人' width="120" align="center"></GridColumn>
                <GridColumn field='phone' title='手机号码' width="120" align="center"></GridColumn>
                <GridColumn field='address' title='收货地址' width="120" align="left"></GridColumn>
                <GridColumn field='logisticsCompanyName' title='物流公司' width="120" align="center"></GridColumn>
                <GridColumn field='logisticsNumber' title='物流单号' width="120" align="center"></GridColumn>
                <GridColumn field='deliveryTime' title='发货时间' width="120" align="center"></GridColumn>
                <template slot="detail" slot-scope="scope">
                    <div style="padding: 5px">
                        <table class="table" style="width:100%">
                            <tbody>
                            <tr>
                                <td class="text-right td" style="width:16.66666%">商品名称</td>
                                <td class="text-left td" colspan="5" style="width:16.66666%">{{ scope.row.commodityName }}</td>
                            </tr>
                            <tr>
                                <td class="text-right td" style="width:16.66666%">商品数量</td>
                                <td class="text-left td" style="width:16.66666%">{{ scope.row.wareNum }}</td>
                                <td class="text-right td" style="width:16.66666%">商品单价</td>
                                <td class="text-left td" style="width:16.66666%">{{ toMoney(scope.row.cost, '') }} 元</td>
                                <td class="text-right td" style="width:16.66666%">递交时间</td>
                                <td class="text-left td" style="width:16.66666%">{{ scope.row.createTime }}</td>
                            </tr>
                            <tr>
                                <td class="text-right td" style="width:16.66666%">收货人</td>
                                <td class="text-left td" style="width:16.66666%">{{ scope.row.consigneeName }}</td>
                                <td class="text-right td" style="width:16.66666%">手机号码</td>
                                <td class="text-left td" style="width:16.66666%">{{ scope.row.phone }}</td>
                                <td class="text-right td" style="width:16.66666%">收货地址</td>
                                <td class="text-left td" style="width:16.66666%">{{ scope.row.address }}</td>
                            </tr>
                            <tr>
                                <td class="text-right td" style="width:16.66666%">物流公司</td>
                                <td class="text-left td" style="width:16.66666%">{{ scope.row.logisticsCompanyName }}</td>
                                <td class="text-right td" style="width:16.66666%">物流单号</td>
                                <td class="text-left td" style="width:16.66666%">{{ scope.row.logisticsNumber }}</td>
                                <td class="text-right td" style="width:16.66666%">发货时间</td>
                                <td class="text-left td" style="width:16.66666%">{{ scope.row.deliveryTime }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
            </DataGrid>
        </LayoutPanel>
        <Dialog ref="sendDlg" closed
                :title="'发货信息录入'"
                :dialogStyle="{width:'600px',height:'500px'}"
                bodyCls="f-column"
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
                        <td class="text-right td">商品单价</td>
                        <td class="text-left td">{{ toMoney(obj.cost, '') }} 元</td>
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
                    <label>物流公司</label><br>

                    <TextBox v-model="obj.logisticsCompanyName" class="form-control">
                        <Addon align="right" v-if="logisticsCompanyGroup.length">
                            <span class="textbox-icon icon-search" @click="$refs.selectLogisticsDlg.open()"></span>
                        </Addon>
                    </TextBox>
                </div>
                <div class="col-12 p-t-15 p-l-15 p-r-15">
                    <label>物流单号</label><br>
                    <input type="text" v-model="obj.logisticsNumber" class="form-control">
                </div>
            </div>
            <div class="dialog-button">
                <LinkButton style="width:80px" @click="save">保存</LinkButton>
                <LinkButton style="width:80px" @click="$refs.sendDlg.close()">关闭</LinkButton>
            </div>
        </Dialog>
        <Dialog ref="selectLogisticsDlg" closed
                :title="'选择物流公司'"
                :dialogStyle="{width:'300px',height:'500px'}"
                bodyCls="f-column"
                :modal="true">
            <div class="f-full">
                <Tree :data="logisticsCompanyGroup" @selectionChange="selectLogisticsCompany($event)"></Tree>
            </div>
        </Dialog>
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
            logisticsCompanyGroup: [],
            allSelected: false,
            deliveryStatus: false
        }
    },
    components: {
        filterList
    },
    created: function () {
        this.loadPage(this.pageNumber, this.pageSize);
        this.loadLogisticsCompanyGroup();
    },
    methods: {
        loadLogisticsCompanyGroup() {
            let vm = this;
            this.getData("supplierPurchaseOrder/getSupplierLogisticsCompanyGroup", {}, function (data) {
                vm.logisticsCompanyGroup = [];
                data.forEach(function (e) {
                    if(e.logisticsCompanyName){
                        vm.logisticsCompanyGroup.push({value: e.logisticsCompanyName, text: e.logisticsCompanyName});
                    }
                })
                console.log(vm.logisticsCompanyGroup);
            })
        },
        onPageChange(event) {
            this.loadPage(event.pageNumber, event.pageSize);
        },
        loadPage(pageNumber, pageSize) {
            this.loading = true;
            let vm = this;
            this.$root.getData("supplierPurchaseOrder/getQueryList", {
                limit: pageSize,
                offset: pageSize * (pageNumber - 1),
                sort: "id",
                direction: "desc",
                filterString: this.filterString,
                deliveryStatus: false,
                notSettlement:false
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
            if(!this.obj.deliveryStatus){
                this.$refs.sendDlg.open();
            }
        },
        filter(filterString) {
            this.filterString = filterString;
            this.loadPage(this.pageNumber, this.pageSize);
        },
        selectLogisticsCompany(obj) {
            this.$set(this.obj,'logisticsCompanyName',obj.text);
            this.$refs.selectLogisticsDlg.close();
        },
        save() {
            let vm = this;
            this.getData("supplierPurchaseOrder/save", this.obj, function (data) {
                vm.loadPage(vm.pageNumber, vm.pageSize);
                vm.loadLogisticsCompanyGroup();
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
                    arr.push({id: e.id});
                }
            })
            if (arr.length > 0) {
                this.confirm('已发货,确认吗?', function () {
                    vm.getData("supplierPurchaseOrder/confirmSend", {rows: JSON.stringify(arr)}, function (data) {
                        vm.loadPage(vm.pageNumber, vm.pageSize);
                    })
                })
            } else {
                this.alert('请勾选发货记录');
            }
        },
        changeStatus() {
            this.loadPage(this.pageNumber, this.pageSize);
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
