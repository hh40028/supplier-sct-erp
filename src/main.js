import Vue from 'vue';
import App from './App.vue';
import router from './router';
import $ from 'jquery';
import 'vx-easyui/dist/themes/bootstrap/easyui.css';
import 'vx-easyui/dist/themes/icon.css';
import 'vx-easyui/dist/themes/vue.css';
import './assets/css/style.css';
import './assets/js/aui-dialog.js';
import './assets/js/aui-toast.js';
import filters from './assets/js/filter.js';
import axios from 'axios';
import VueAxios from 'vue-axios';
import EasyUI from 'vx-easyui';

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));
Vue.use(VueAxios, axios);
Vue.use(EasyUI);

Vue.config.productionTip = false
//后台服务路径
Vue.prototype.bus = new Vue;
//获取后台数据
Vue.prototype.getData = function (action, obj, fun) {
    let vm = this;
    $.ajax({
        url: this.$root.basePath + action,
        type: "post",
        data: obj,
        headers: {
            token: sessionStorage.token
        },
        async: true,
        dataType: "json",
        success: function (data) {
            if (data.success) {
                fun(data.children);
            } else {
                console.log("action:" + action);
                vm.handleErrInfo(data);
            }
        },
        error: function (xhr) {
            if (xhr.status === 404) {
                alert("404错误：" + action);
            }
        }
    });
};
//处理错误
Vue.prototype.handleErrInfo = function (obj) {
    if (obj.message === 'login') {
        this.$root.userObj = undefined;
        sessionStorage.removeItem("userObj");
        sessionStorage.removeItem("token");
        location.href='./login.html';
    } else if (obj.message === 'nopower') {
        this.$router.push('noPower');
    } else {
        this.alert(obj.message);
    }
}
Vue.prototype.toMoney = function (price, chars) {
    chars = chars ? chars.toString() : '';
    // chars = chars ? chars.toString() : '￥';
    if (!price) {
        return chars + '0.00';
    }
    if (price > 0) {
        let priceString = price;
        try {
            priceString = price.toFixed(2);
        } catch (e) {
        }
        let priceInt = parseInt(price);
        let len = priceInt.toString().length;
        let num = len / 3;
        let remainder = len % 3;
        let priceStr = '';
        for (let i = 1; i <= len; i++) {
            priceStr += priceString.charAt(i - 1);
            if (i == (remainder) && len > remainder) priceStr += ',';
            if ((i - remainder) % 3 == 0 && i < len && i > remainder) priceStr += ',';
        }
        if (priceString.indexOf('.') < 0) {
            priceStr = priceStr + '.00';
        } else {
            priceStr += priceString.substr(priceString.indexOf('.'));
            if (priceString.length - priceString.indexOf('.') - 1 < 2) {
                priceStr = priceStr + '0';
            }
        }
        return chars + priceStr;
    } else {
        return chars + price;
    }
}
//确认框
Vue.prototype.confirm = function (msg, func) {
    $('.aui-mask').remove();
    $('.aui-dialog').remove();
    new auiDialog().alert({
        title: '提示信息',
        msg: msg,
        buttons: ['取消', '确定']
    }, function (ret) {
        if (ret.buttonIndex === 2) {
            func();
        }
    });
};
//提示气泡
Vue.prototype.msg = function (m) {
    new auiToast().success({
        title: m,
        duration: 3000
    });
};
//提示框
Vue.prototype.alert = function (msg, func) {
    $('.aui-mask').remove();
    $('.aui-dialog').remove();
    new auiDialog().alert({
        title: '提示信息',
        msg: msg,
        buttons: ['确定']
    }, function () {
        if (func) {
            func();
        }
    });
};
//克隆对象
Vue.prototype.clone = function (obj) {
    let o;
    switch (typeof obj) {
        case 'undefined':
            break;
        case 'string':
            o = obj + '';
            break;
        case 'number':
            o = obj - 0;
            break;
        case 'boolean':
            o = obj;
            break;
        case 'object':
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    for (let i = 0, len = obj.length; i < len; i++) {
                        o.push(this.clone(obj[i]));
                    }
                } else {
                    o = {};
                    for (let k in obj) {
                        o[k] = this.clone(obj[k]);
                    }
                }
            }
            break;
        default:
            o = obj;
            break;
    }
    return o;
};


new Vue({
    data() {
        return {
            // basePath: 'http://erpserver.fuservice.com/',
            basePath: 'http://116.196.112.7/',
            uesrObj: undefined,
            menu: {text: '首页'},
            twomenu: {},
            taskcount: 1
        }
    },
    created() {
        if (sessionStorage.userObj && sessionStorage.token) {
            this.userObj = JSON.parse(sessionStorage.userObj);
        }else{
            location.href='/login.html'
        }
    },
    methods: {
    },
    router,
    render: h => h(App)
}).$mount('#app')
