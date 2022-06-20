import request from '@/utils/request'

export default{ 
    getNormalList(){
        return request({
            url: `/fault/fault/list`,
            method: 'get',
        })
            },  
// 分页列表
    getList(searchMap, page = 1, size = 20) {
        return request({
            url: `/fault/fault/search`,
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
            url: `/fault/fault/option`,
            method: 'post',
            data
        })
    },
    getById(id){
        return request({
            url: '/fault/fault/option',
            method: 'get',
            params:{
                id
            }
        })
    },
    update(data){
        return request({
            url: `/fault/fault/option`,
            method: 'put',
            data
        })
    },
    deleteById(id){
        return request({
            url: '/fault/fault/option',
            method: 'delete',
            params:{
                id
            }
        })
    },
    uploadDeviceAppFile(data = {}) {
        return request({
          url: `/fault/fault/upload/app`,
          method: 'post',
          data // data: data 简写
        })
      },
      // 删除APP文件接口
      deleteDeviceAppFile(imageUrl) {
        return request({
          url: `/fault/fault/upload/app`,
          method: 'delete',
          params: { 'fileUrl': imageUrl }
        })
      },
      //树形显示零件类型，零件
      getListTree(){
        return request({
            url: '/fault/fault/list/tree',
            method: 'get',
           
        })
      },
     getBypartCategoryID(id){
        return request({
            url: '/fault/fault/list/partCategoryID',
            method: 'get',
            params:{
                id
            }
        })
    },
}
