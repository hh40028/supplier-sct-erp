<template>
    <Layout style="width:100vw;height:100vh" :border="false" bodyCls="f-column">
        <LayoutPanel region="north" style="height:50px;">
            <div class="text-left col-4">
                <div style="font-size: 20px;font-weight: 700;padding:10px">商采通ERP系统-供应商端</div>
            </div>
            <div class="col-4">
            </div>
            <div class="col-4 text-right">
                <div style="float: right;" class="m-r-10 title c-orange" @click="logout">注销</div>
            </div>
        </LayoutPanel>
        <LayoutPanel region="west" style="width:60px;">
            <div class="text-center" @click="go('purchaseOrder')" style="margin-bottom: 15px;margin-top: 15px">
                <img src="../src/assets/images/icons8-purchase_order.png" style="width:35px">
                <div style="text-align: center;padding-bottom: 10px;font-size: 14px">
                    采购单
                </div>
            </div>
            <div class="text-center" @click="go('finishPurchaseOrder')" style="margin-bottom: 15px;margin-top: 15px">
                <img src="../src/assets/images/icons8-truck.png" style="width:35px">
                <div style="text-align: center;padding-bottom: 10px;font-size: 14px">
                    发货单
                </div>
            </div>
            <div class="text-center" @click="go('accountReconciliation')" style="margin-bottom: 15px;margin-top: 15px">
                <img src="../src/assets/images/icons8-drag_reorder.png" style="width:35px">
                <div style="text-align: center;padding-bottom: 10px;font-size: 14px">
                    对账单
                </div>
            </div>
            <div class="text-center" style="margin-bottom: 15px;margin-top: 15px">
                <img src="../src/assets/images/icons8-user.png" style="width:35px">
                <div style="text-align: center;margin-bottom: 10px;padding-bottom: 10px;font-size: 14px">
                    我的
                </div>
            </div>
        </LayoutPanel>
        <LayoutPanel region="center" style="height:100%">
            <router-view/>
        </LayoutPanel>
    </Layout>
</template>

<script>
export default {
    data() {
        return {
            title: 'AppLayout',
            width: 200,
            collapsed: false,
            selectedMenu: null,
        };
    },
    methods: {
        go(url) {
            this.$router.push(url);
        },
        logout() {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("userObj");
            location.href = './login.html';
        }
    }
};
</script>
