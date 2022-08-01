import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue'
import index from '../views/index.vue'
import nav from '../views/nav.vue'
import emptyToNav from '../views/emptyToNav.vue'
import empty from '../views/empty.vue'
import purchaseOrder from '../views/purchaseOrder.vue'
import accountReconciliation from '../views/accountReconciliation.vue'
import finishPurchaseOrder from '../views/finishPurchaseOrder.vue'

Vue.use(VueRouter)

const routes = [
  {path: '/', name: 'index', component: index},
  {path: '/index', name: 'index', component: index},
  {path: '/login', name: 'login', component: login},
  {path: '/emptyToNav', name: 'emptyToNav', component: emptyToNav},
  {path: '/empty', name: 'empty', component: empty},
  {path: '/nav', name: 'nav', component: nav},
  {path: '/purchaseOrder', name: 'purchaseOrder', component: purchaseOrder},
  {path: '/accountReconciliation', name: 'accountReconciliation', component: accountReconciliation},
  {path: '/finishPurchaseOrder', name: 'finishPurchaseOrder', component: finishPurchaseOrder},
]

const router = new VueRouter({
  routes
})

export default router
