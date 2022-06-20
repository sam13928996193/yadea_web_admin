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
        <el-form-item label="上级经销商" prop="agentID">
           <el-select clearable v-model="pojo.agentID"  placeholder="请选择经销商">
              <el-option
                v-for="item in AgentOptions"
                :key="item.id"
                :label="item.agentName"
                :value="item.id">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="编号" prop="repairShopCode">
          <el-input v-model="pojo.repairShopCode"></el-input>
        </el-form-item>
        <el-form-item label="维修店名称" prop="repairShopName">
          <el-input v-model="pojo.repairShopName"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkmen">
          <el-input v-model="pojo.linkmen"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="pojo.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="pojo.email"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="adress">
          <el-input v-model="pojo.adress"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio  v-model="pojo.status" label = 0>注销</el-radio>
          <el-radio  v-model="pojo.status" label = 1>有效</el-radio>
        </el-form-item>
        <el-form-item label="创建日期" prop="createDate">
          <el-date-picker disabled
            value-format="yyyy-mm-dd"
            type="date"
            placeholder="创建日期"
            v-model="pojo.createDate"
            style="width: 50%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="pojo.remark"></el-input>
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
  import repairShopApi from '@/api/repairShop';
  export default ({
    // props是父组件传递的数据或执行的方法
    props:{
      title:{
        type: String,
        default: ''
      },
      dialogVisible: {
        type: Boolean,
        default: false
      },
      remoteClose:Function,   //这个方法是父组件传递的 用于关闭窗口
      pojo:{//提交的表单数据
        type: Object,
        default: {

        }
      },
      AgentOptions:{
        type: Array,
        default:[]
      }
    },
    data() {
      return {
        rules: {
          agentCode: [
            { required: true, message: '请输入经销商代号', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          agentName: [
            { required: true, message: '请输入经销商名称', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ],
         
          createDate: [
            { required: true, message: '请选择创建日期', trigger: 'blur' }
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
          response = await repairShopApi.update(this.pojo);
        }else{
          //新增
          response = await repairShopApi.add(this.pojo);
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
  }});
</script>