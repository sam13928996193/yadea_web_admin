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
        <el-form-item label="程序代号" prop="fileCode">
          <el-input v-model="pojo.fileCode"></el-input>
        </el-form-item>
        <el-form-item label="程序名称" prop="fileName">
          <el-input v-model="pojo.fileName"></el-input>
        </el-form-item>
        <el-form-item label="程序版本号" prop="fileVersion">
          <el-input v-model="pojo.fileVersion"></el-input>
        </el-form-item>
         <el-form-item label="程序路径" prop="fileUrl">
          <el-input v-model="pojo.fileUrl"></el-input>
          <el-upload
            class="upload-demo"
            drag
            action=""
            :show-file-list="true"
            :http-request="uploadMainFile"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传XXX文件</div>
          </el-upload>
        </el-form-item>       
        <el-form-item label="状态" prop="status">
          <el-radio disabled v-model="pojo.status" label = 0>历史</el-radio>
          <el-radio disabled v-model="pojo.status" label = 1>当前</el-radio>

        </el-form-item>
        <el-form-item label="创建日期" prop="createDate">
          <el-date-picker
            value-format="yyyy-mm-dd"
            type="date"
            placeholder="创建日期"
            v-model="pojo.createDate"
            style="width: 50%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注"   prop="remark">
          <el-input type="textarea" v-model="pojo.remark"></el-input>
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
  import deviceVciFileApi from '@/api/deviceVciFile';
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

        },
      oldFileUrl:{
        type: String,
        default:null
      }
      }
    },
    data() {
      return {
        rules: {
          fileCode: [
            { required: true, message: '请输入文件编号', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ],
          fileName: [
            { required: true, message: '请输入文件名称', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ],
          fileVersion: [
            { required: true, message: '请输入APP版本号', trigger: 'blur' },
            { min: 1, max: 64, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ],
          fileUrl: [
            { required: true, message: '请上传程序文件', trigger: 'blur' },
            { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
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
          response = await deviceVciFileApi.update(this.pojo);
        }else{
          //新增
          response = await deviceVciFileApi.add(this.pojo);
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
        deviceVciFileApi.uploadDeviceAppFile(data).then(response=>{
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
           deviceVciFileApi.deleteDeviceAppFile(this.pojo.fileUrl);

        }
      }
  }});
</script>