// 定义状态对象
const state = {
    isCollapse : false,  // 控制侧边栏是否折叠的状态
    selectMenu : []      // 存储选中的菜单项
}

// 定义修改状态的方法
const mutations= {
    // 切换侧边栏折叠状态的方法
    collapseMenu (state) {
        state.isCollapse = !state.isCollapse  // 将当前折叠状态取反
    },
    addMenu (state , payload) {
        //对数据去重    
        if(state.selectMenu.findIndex(item => item.path === payload.path) === -1) {
            state.selectMenu.push(payload)
        }
    },
    closeMenu (state, payload)  {
        //找到点击数据的索引
        const index = state.selectMenu.findIndex(val => val.name === payload.name)
        //通过索引删除数组指定元素
        state.selectMenu.splice(index , 1)
    }
    
}

// 导出状态管理模块
export default {
    state,      // 导出状态
    mutations   // 导出修改方法
}