<template>
    <div class="header-container">
        <div class="header-left flex-box">
            
            <el-icon class="icon" size="12"  @click="store.commit('collapseMenu')"><Fold /></el-icon>

            <ul class="flex-box" >
                <li v-for="(item , index ) in selectMenu" 
                :key="item.path"
                :class="{selected: route.path === item.path}"
                class="tab flex-box">
                    <el-icon  size="12" ><component :is="item.icon" /></el-icon>
                    <router-link class="icon flex-box" :to="{path : item.path}">
                        {{ item.name }}
                    </router-link>
                    <el-icon class="close" size="12" @click="closeTab(item,index)"><Close/></el-icon>
                </li>
            </ul>

        </div>


        <div class="header-right ">
            <el-dropdown>
                <div class="el-dropdown-link flex-box">
                        <el-avatar
                            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                        />
                        <p class="user-name">admin</p>
                </div>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>Action 1</el-dropdown-item>
                    <el-dropdown-item>Action 2</el-dropdown-item>
                    <el-dropdown-item>Action 3</el-dropdown-item>
                    <el-dropdown-item disabled>Action 4</el-dropdown-item>
                    <el-dropdown-item divided>Action 5</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>

    </div>
</template>





<script setup>
    import { useStore } from 'vuex';
    import { computed } from 'vue';
    import { useRoute,useRouter } from 'vue-router';
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const selectMenu = computed(() => store.state.menu.selectMenu)

    //点击关闭tag
    const closeTab = (item, index) => {
        //删除的非当前页
        if(route.path !== item.path) {
            store.commit('closeMenu', item)
            return
        }
        const selectedMenuData = selectMenu.value

        // 如果删除的是最后一个标签
        if(index === selectedMenuData.length - 1) {
            if(selectedMenuData.length === 1) {
                router.push('/')
            } else {
                router.push({
                    path: selectedMenuData[index - 1].path
                })
            }
        } else { //删除中间
            router.push({
                path: selectedMenuData[index + 1].path
            })
        }
        store.commit('closeMenu', item)
    }
</script>





<style lang="less" scoped>
.flex-box {
    display: flex;
    align-items: center;
    height: 100%;
}

.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    background-color: white;
    padding-right: 25px;

    .header-left {
        height: 100%;

        .icon {
            width: 45px;
            height: 100%;
        }

        .icon:hover {
            background-color: #f5f5f5;
            cursor: pointer;
        }

        .tab {
            padding: 0 10px;
            height: 100%;

            .text {
                margin: 0 5px;
            }
            .close {
                visibility: hidden;
                margin-left: 5px;
            }
            &.selected{
                a {
                    color: #409eff;
                }
                i{
                    color: #409eff;

                }
                background: #f5f5f5;
            }
        }

        .tab:hover {
            background-color: #f5f5f5;
            
            .close {
                visibility: visible;
                cursor: pointer;
                color: #000;
            }
        }
    }

    .header-right {
        .user-name {
            margin-left: 10px;
        }
    }

    a {
        height: 100%;
        color: #333;
        font-size: 11px;
    }
}
</style>