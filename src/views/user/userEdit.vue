<template>
    <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="500px"
    :before-close="handleClose"
    :close-on-click-modal="false">
    
    <el-form
        status-icon
        ref="formData"
        :rules="rules"
        :model="pojo"
        label-position="right"
        label-width="100px"
        style="width: 400px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="pojo.username" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="pojo.nickname" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="pojo.mobile" maxlength="11"></el-input>
        </el-form-item>
         <el-form-item label="邮箱" prop="email">
          <el-input v-model="pojo.email"></el-input>
        </el-form-item>
        <el-form-item label="账号过期"  prop="isAccountNonExpired">
          <el-radio  v-model="pojo.isAccountNonExpired" :label = "0" border>正常</el-radio>
          <el-radio  v-model="pojo.isAccountNonExpired" :label = "1" border>过期</el-radio>
        </el-form-item>
       <el-form-item label="账号锁定"   prop="isAccountNonLocked">
          <el-radio  v-model="pojo.isAccountNonLocked" :label = "0" border>正常</el-radio>
          <el-radio  v-model="pojo.isAccountNonLocked" :label = "1" border>锁定</el-radio>
        </el-form-item>
        <el-form-item label="密码过期"  prop="isCredentialsNonExpired">
          <el-radio  v-model="pojo.isCredentialsNonExpired" :label = "0" border>正常</el-radio>
          <el-radio  v-model="pojo.isCredentialsNonExpired" :label = "1" border>过期</el-radio>
        </el-form-item>
       
      </el-form>


    <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="submitForm('formData')">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>
  var d = new Date();
  import * as userApi from '@/api/user'
  export default ({
    // props是父组件传递的数据或执行的方法
    props:{
      title:{
        type: String,
        default: ''
      },
      dialogVisible:{
        type:Boolean,
        default: false
      },
      remoteClose:Function,   //这个方法是父组件传递的 用于关闭窗口
      pojo:{//提交的表单数据
        type: Object,
        default: {id: null,
              createUserID:'',
              createDate: new Date(),
              lastUserID: '',
              lastDate: new Date(),
              username:'',
              password:'',
              nickname:'',
              imageUrl:'',
              mobile:'',
              email:'',
              isAccountNonExpired: 0,
              isAccountNonLocked: 0,
              isCredentialsNonExpired: 0,
              isSupervisor: 0,
              role:'',
              remark: ''

        }
      }
    },
    data() {
      return {
        rules: {
          username: [
            { required: true, message: '请输入用户名称', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30个字符', trigger: 'blur' }
          ],
          nickname: [
            { required: true, message: '请输入昵称', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 11 个字符', trigger: 'blur' }
          ],
          isAccountNonExpired:[
            { required: true, message: '请输入账号是否过期', trigger: 'change' }
            ],
          isAccountNonLocked:[
            { required: true, message: '请输入账号是否锁定', trigger: 'change' }
            ],
          isCredentialsNonExpired:[
            { required: true, message: '请输入密码是否过期', trigger: 'change' }
            ]
        }
      }
    },
    methods: {
      // formName就是传递进来的ref名字
      submitForm(formName) {
          this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitData();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      async submitData(){
        let response = null
        if(this.pojo.id){
          // 修改
          response = await userApi.update(this.pojo);
        }else{
          //新增
          response = await userApi.add(this.pojo);
        }
          
        if (response.code ===20000){
             this.$message({
                message: response.message,
                type: 'success'
              });
              // 关闭窗口
              this.handleClose();
        }else{
             this.$message({
                message: "保存失败",
                type: 'error'
              });
        }
      },

      handleClose(){
        console.log('关闭')
        // 重置表单数据
        this.$refs['formData'].resetFields();
        // 触发父组件remoteClose事件
        this.remoteClose()
      }
  }
  });
</script>