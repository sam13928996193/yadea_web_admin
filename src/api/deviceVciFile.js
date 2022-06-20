import request from '@/utils/request'

export default{ 
// 分页列表
    getList(searchMap, page = 1, size = 20) {
        return request({
            url: `device/deviceVciFile/search`,
            method: 'post',
            data:{
                ...searchMap,
                page,
                size
            }
        })
    },
    add(data){
        return request({
            url: `device/deviceVciFile/option`,
            method: 'post',
            data
        })
    },
    getById(id){
        return request({
            url: 'device/deviceVciFile/option',
            method: 'get',
            params:{
                id
            }
        })
    },
    update(data){
        return request({
            url: `device/deviceVciFile/option`,
            method: 'put',
            data
        })
    },
    deleteById(id){
        return request({
            url: 'device/deviceVciFile/option',
            method: 'delete',
            params:{
                id
            }
        })
    },
    uploadDeviceAppFile(data = {}) {
        return request({
          url: `/device/deviceVciFile/upload/app`,
          method: 'post',
          data // data: data 简写
        })
      },
      // 删除APP文件接口
      deleteDeviceAppFile(imageUrl) {
        return request({
          url: `/device/deviceVciFile/upload/app`,
          method: 'delete',
          params: { 'fileUrl': imageUrl }
        })
      }
}
