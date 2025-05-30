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
        ref="loginFormRef"
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
import { getCode, userAuthentication, login } from "../../api";
import { Lock, UserFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
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
/**
 * 验证码校验函数
 * 注册时验证码不能为空
 */
const validateCode = (rule, value, callback) => {
  if (formType.value && value === "") {
    callback(new Error("请输入验证码"));
  } else {
    callback();
  }
};

//表单校验规则
const rules = reactive({
  userName: [{ validator: validateUser, trigger: "blur" }],
  passWord: [{ validator: validatePass, trigger: "blur" }],
  validCode: [{ validator: validateCode, trigger: "blur" }],
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
  const time = setInterval(() => {
    if (countdown.time <= 0) {
      countdown.time = 60;
      countdown.validText = `获取验证码`;
      flag = false;
      clearInterval(time);
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
const router = useRouter();
const loginFormRef = ref();

/**
 * 表单提交函数
 * 根据formType判断是登录还是注册
 * 先进行表单验证，验证通过后再调用对应的API
 */
const submitForm = async () => {
  if (!loginFormRef.value) return;

  try {
    // 手动触发表单校验
    const valid = await loginFormRef.value.validate();

    if (valid) {
      console.log("表单验证通过，开始提交");

      // 根据formType判断是注册还是登录
      if (formType.value) {
        // 注册逻辑
        try {
          const { data } = await userAuthentication(loginForm);
          if (data.code == 10000) {
            ElMessage({
              message: "注册成功",
              type: "success",
            });
            // 注册成功后切换到登录页面
            formType.value = 0;
            // 清空表单
            loginForm.userName = "";
            loginForm.passWord = "";
            loginForm.validCode = "";
          } else {
            ElMessage({
              message: data.message || "注册失败",
              type: "error",
            });
          }
        } catch (error) {
          console.error("注册请求失败:", error);
          ElMessage({
            message: "注册请求失败，请稍后重试",
            type: "error",
          });
        }
      } else {
        // 登录逻辑
        try {
          const { data } = await login(loginForm);
          if (data.code == 10000) {
            // 先保存登录信息
            localStorage.setItem("pz_token", data.data.token);
            localStorage.setItem("pz_userInfo", JSON.stringify(data.data.userInfo));

            // 显示成功消息（3秒后自动关闭）
            ElMessage({
              message: "登录成功，正在跳转...",
              type: "success",
              duration: 3000,
            });

            // 延迟一点时间再跳转，确保用户看到成功消息
            setTimeout(() => {
              // 使用 replace 方法强制跳转，确保路由守卫重新执行
              router.replace("/dashboard");
            }, 1000);
          } else {
            ElMessage({
              message: data.message || "登录失败",
              type: "error",
            });
          }
        } catch (error) {
          console.error("登录请求失败:", error);
          ElMessage({
            message: "登录请求失败，请稍后重试",
            type: "error",
          });
        }
      }
    }
  } catch (error) {
    console.log("表单验证失败:", error);
    ElMessage({
      message: "请检查输入信息是否正确",
      type: "warning",
    });
  }
};
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
