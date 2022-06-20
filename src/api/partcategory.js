import request from '@/utils/request'

export default{ 
    //选择列表
    getNormalList(){
    return request({
        url: `/part/partCategory/list`,
        method: 'get',
    })
        },  
// 分页列表
    getList(searchMap, page = 1, size = 20) {
        return request({
            url: `/part/partCategory/search`,
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
            url: `/part/partCategory/option`,
            method: 'post',
            data
        })
    },
    getById(id){
        return request({
            url: '/part/partCategory/option',
            method: 'get',
            params:{
                id
            }
        })
    },
    update(data){
        return request({
            url: `/part/partCategory/option`,
            method: 'put',
            data
        })
    },
    deleteById(id){
        return request({
            url: '/part/partCategory/option',
            method: 'delete',
            params:{
                id
            }
        })
    },
    uploadDeviceAppFile(data = {}) {
        return request({
          url: `/part/partCategory/upload/app`,
          method: 'post',
          data // data: data 简写
        })
      },
      // 删除APP文件接口
      deleteDeviceAppFile(imageUrl) {
        return request({
          url: `/part/partCategory/upload/app`,
          method: 'delete',
          params: { 'fileUrl': imageUrl }
        })
      }
}
