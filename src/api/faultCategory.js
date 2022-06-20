import request from '@/utils/request'

export default{ 
    //树形显示零件类型及下属故障类型
    getListTree(){
        return request({
            url: '/fault/faultCategory/list/tree',
            method: 'get',
           
        })
      },
    //选择列表
    getNormalList(){
    return request({
        url: `/fault/faultCategory/list`,
        method: 'get',
    })
        },  
// 分页列表
    getList(searchMap, page = 1, size = 20) {
        return request({
            url: `/fault/faultCategory/search`,
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
            url: `/fault/faultCategory/option`,
            method: 'post',
            data
        })
    },
    getById(id){
        return request({
            url: '/fault/faultCategory/option',
            method: 'get',
            params:{
                id
            }
        })
    },
    update(data){
        return request({
            url: `/fault/faultCategory/option`,
            method: 'put',
            data
        })
    },
    deleteById(id){
        return request({
            url: '/fault/faultCategory/option',
            method: 'delete',
            params:{
                id
            }
        })
    },
    uploadFile(data = {}) {
        return request({
          url: `/fault/faultCategory/upload/app`,
          method: 'post',
          data // data: data 简写
        })
      },
      // 删除APP文件接口
      deleteFile(imageUrl) {
        return request({
          url: `/fault/faultCategory/upload/app`,
          method: 'delete',
          params: { 'fileUrl': imageUrl }
        })
      }
}
