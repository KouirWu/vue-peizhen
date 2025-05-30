<template>
  <el-row class="login-container" justify="center" :align="'middle'">
    <el-card style="max-width: 480px">
      <template #header>
        <div class="card-header">
          <img :src="imgUrl" alt="" />
        </div>
      </template>
      <div class="jump-link">
        <el-link type="primary" @click="handleChange">{{
          formType ? "返回登录" : "注册账号"
        }}</el-link>
      </div>
      <el-form
        :model="loginForm"
        style="max-width: 600px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item prop="userName">
          <el-input
            v-model="loginForm.userName"
            placeholder="手机号"
            prefix-icon="UserFilled"
          ></el-input>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input
            v-model="loginForm.passWord"
            placeholder="密码"
            type="password"
            prefix-icon="Lock"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="formType" prop="validCode">
          <el-input v-model="loginForm.validCode" placeholder="验证码" prefix-icon="Lock">
            <template #append>
              <span @click="countdownChange">{{ countdown.validText }}</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :style="{ width: '100%' }" @click="submitForm">
            {{ formType ? "注册账号" : "登录账号" }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>

<script setup>
import { ref, reactive } from "vue";
import { getCode } from "../../api";
const imgUrl = new URL("../../../public/login-head.png", import.meta.url).href;

//表单初始数据
const loginForm = reactive({
  userName: "",
  passWord: "",
  validCode: "",
});
//切换表单（0登入 1注册）
const formType = ref(0);

//点击声明注册
const handleChange = () => {
  formType.value = formType.value ? 0 : 1;
};

const validateUser = (rule, value, callback) => {
  //不能为空
  if (value === "") {
    callback(new Error("请输入账号"));
  } else {
    const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    phoneReg.test(value)
      ? callback()
      : callback(new Error("手机号格式不对，请输入正确手机号"));
  }
};

//密码校验
const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    const reg = /^[a-zA-Z0-9_-]{4,16}$/;
    reg.test(value)
      ? callback()
      : callback(new Error("密码格式不对，需要4到16位字符，请确认格式是否正确"));
  }
};
//表单校验
const rules = reactive({
  userName: [{ validator: validateUser, trigger: "blur" }],
  passWord: [{ validator: validatePass, trigger: "blur" }],
});

//发送短信
const countdown = reactive({
  validText: "获取验证码",
  time: 60,
});
let flag = false;
const countdownChange = () => {
  //如果已发送不处理
  if (flag) return;
  //判断手机号是否正确
  const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
  if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
    return ElMessage({
      message: "请检查手机号是否正确",
      type: "warning",
    });
  }
  //倒计时
  setInterval(() => {
    if (countdown.time <= 0) {
      countdown.time = 60;
      countdown.validText = `获取验证码`;
      flag = false;
    } else {
      countdown.time -= 1;
      countdown.validText = `剩余${countdown.time}s`;
    }
    flag = true;
  }, 1000);
  getCode({ tel: loginForm.userName }).then(({ data }) => {
    if (data.code == 10000) {
      ElMessage({
        message: "发送成功",
        type: "success",
      });
    }
  });
};

//表单提交
const submitForm = () => {};
</script>

<style lang="less" scoped>
:deep(.el-card__header) {
  padding: 0;
}
.login-container {
  height: 100%;
  .card-header {
    background-color: #899fe1;
    img {
      width: 430px;
    }
  }
  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>
