import request from '@/utils/request'
// 公共接口
export default {
// 上传APP文件接口
  uploadDeviceAppFile(data = {}) {
    return request({
      url: `/device/deviceAppFile/upload/app`,
      method: 'post',
      data // data: data 简写
    })
  },
  // 删除APP文件接口
  deleteDeviceAppFile(imageUrl) {
    return request({
      url: `/device/deviceAppFile/upload/app`,
      method: 'delete',
      params: { 'fileUrl': imageUrl }
    })
  }
}
