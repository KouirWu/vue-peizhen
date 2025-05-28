// 导入 Vuex 的 createStore 方法
import { createStore } from "vuex";
// 导入菜单模块
import menu from "./menu";

// 创建并导出 Vuex store 实例
export default createStore({
    modules:{  // 注册模块
        menu   // 注册菜单模块
    }
})