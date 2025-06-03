<template>
  <div>
    <button @click="openDialog">打开</button>
    <el-dialog
      v-model="dialogFormVisible"
      :before-close="beforeClose"
      title="添加权限"
      width="500"
    >
      <el-form
        ref="formRef"
        label-width="100px"
        label-position="left"
        :model="form"
        :rules="rules"
      >
        <el-form-item v-show="false" prop="id">
          <el-input v-model="form.id" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请填写权限名称" />
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <!-- 显示数据加载状态 -->
          <div v-if="permissionData.length === 0" style="color: #999; padding: 10px">
            正在加载权限数据...
          </div>
          <el-tree
            v-else
            ref="treeRef"
            style="max-width: 600px"
            :data="permissionData"
            node-key="id"
            show-checkbox
            :default-checked-keys="defaultKeys"
            :props="treeProps"
            :default-expanded-keys="[2]"
          >
            <!-- 使用插槽自定义节点显示内容 -->
            <template #default="{ node, data }">
              <span>
                {{
                  data.title ||
                  data.name ||
                  data.label ||
                  data.menuName ||
                  data.text ||
                  "未知节点"
                }}
              </span>
            </template>
          </el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirm(formRef)">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { ElTree } from "element-plus";
import { userGetMenu, userSetMenu, menuList } from "../../../api";

onMounted(() => {
  // 获取菜单权限数据
  userGetMenu()
    .then((data) => {
      // 检查数据是否存在
      if (data && data.data && data.data.data) {
        // API返回的结构是: {data: {code: 10000, message: 'success', data: Array}}
        // 我们需要的是最内层的data数组
        permissionData.value = data.data.data;
      } else {
        console.warn("API返回的数据格式不正确:", data);
        ElMessage.warning("获取权限数据失败：数据格式错误");
      }
    })
    .catch((error) => {
      console.error("获取菜单数据失败:", error);
      ElMessage.error("获取权限数据失败，请检查网络连接");
    });
  getListData();
});

const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});

const getListData = () => {
  menuList(paginationData).then(({ data }) => {});
};

//form的数据
const form = reactive({
  name: "",
  permissions: "",
  id: "",
});

//树形菜单权限数据
const permissionData = ref([]);
//控制弹窗的显示隐藏
const dialogFormVisible = ref(false);

// el-tree组件的属性配置
// 尝试常见的文本字段名
const treeProps = {
  children: "children", // 子节点的字段名
  label: "title", // 显示文本的字段名（尝试title字段）
  disabled: "disabled", // 禁用状态的字段名
};

// 打开弹窗的函数
const openDialog = () => {
  dialogFormVisible.value = true;
};

//弹窗关闭前的回调
const beforeClose = () => {
  dialogFormVisible.value = false;
};

// 默认选中的节点
const defaultKeys = [4, 5];

// 表单引用
const formRef = ref();
// 树组件引用
const treeRef = ref();

const rules = reactive({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
});
// 表单提交函数
const confirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 获得选中的checkbox数据（从树组件获取）
      const permission = JSON.stringify(treeRef.value.getCheckedKeys());

      userSetMenu({
        name: form.name,
        permissions: permission, // 将选中的权限数据传递给后端
        id: form.id,
      })
        .then((data) => {
          console.log("权限设置成功:", data);
          // 关闭弹窗
          dialogFormVisible.value = false;
          // 重置表单
          formEl.resetFields();
        })
        .catch((error) => {
          console.error("权限设置失败:", error);
        });
    } else {
      console.log("表单验证失败:", fields);
      return false;
    }
  });
};
</script>

<style lang="less" scoped></style>
