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
        <el-form-item label="车系编号" prop="vehicleSeriesCode">
          <el-input v-model="pojo.vehicleSeriesCode"></el-input>
        </el-form-item>
        <el-form-item label="车系名称" prop="vehicleSeriesName">
          <el-input v-model="pojo.vehicleSeriesName"></el-input>
        </el-form-item>
         <el-form-item label="车系图标" prop="fileUrl">
          <el-input v-model="pojo.fileUrl"></el-input>
          <el-upload
            class="avatar-uploader"
            drag
            action=""
            :show-file-list="false"
            :http-request="uploadMainFile"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            >
            <img v-if="pojo.fileUrl" :src="pojo.fileUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>



        </el-form-item>       
        <el-form-item label="状态" prop="status">
          <el-radio disabled v-model="pojo.status" label = 0>注销</el-radio>
          <el-radio disabled v-model="pojo.status" label = 1>正常</el-radio>
          <el-radio disabled v-model="pojo.status" label = 2>维修</el-radio>
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
  import vehicleSeriesApi from '@/api/vehicleSeries';
  export default {
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
      }
    },
    data() {
      return {
        rules: {
          vehicleSeriesCode: [
            { required: true, message: '请输入车系编号号', trigger: 'blur' },
            { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
          ],
          vehicleSeriesName: [
            { required: true, message: '请输入APP版本号', trigger: 'blur' },
            { min: 4, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
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
          response = await vehicleSeriesApi.update(this.pojo);
        }else{
          //新增
          response = await vehicleSeriesApi.add(this.pojo);
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
      },

       // 上传文件，file为上传的文件对象
      uploadMainFile(file){
         console.log('上传文件',file)
        const data = new FormData()
        data.append('file',file.file);
        vehicleSeriesApi.uploadFile(data).then(response=>{
          this.deleteDeviceAppFile();
          console.log(response.data);
          this.pojo.fileUrl = response.data;
        }).catch(error=>{
          this.$message({
                message: "上传失败",
                type: 'error'
              });
        })
      },
      deleteDeviceAppFile(){
        // 如果之前有文件，就删除
        if(this.pojo.fileUrl && this.pojo.fileUrl !== this.oldFileUrl){
           vehicleSeriesApi.deleteFile(this.pojo.fileUrl);

        }
      },
  handleAvatarSuccess(res, file) {
        this.pojo.fileUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
  }};
</script>