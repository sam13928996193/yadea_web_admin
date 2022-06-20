import request from '@/utils/request'

export default{ 
    getNormalList(){
        return request({
            url: `/part/part/list`,
            method: 'get',
        })
            },  
// 分页列表
    getList(searchMap, page = 1, size = 20) {
        return request({
            url: `/part/part/search`,
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
            url: `/part/part/option`,
            method: 'post',
            data
        })
    },
    getById(id){
        return request({
            url: '/part/part/option',
            method: 'get',
            params:{
                id
            }
        })
    },
    update(data){
        return request({
            url: `/part/part/option`,
            method: 'put',
            data
        })
    },
    deleteById(id){
        return request({
            url: '/part/part/option',
            method: 'delete',
            params:{
                id
            }
        })
    },
    uploadDeviceAppFile(data = {}) {
        return request({
          url: `/part/part/upload/app`,
          method: 'post',
          data // data: data 简写
        })
      },
      // 删除APP文件接口
      deleteDeviceAppFile(imageUrl) {
        return request({
          url: `/part/part/upload/app`,
          method: 'delete',
          params: { 'fileUrl': imageUrl }
        })
      },
      //树形显示零件类型，零件
      getListTree(){
        return request({
            url: '/part/part/list/tree',
            method: 'get',
           
        })
      },
     getBypartCategoryID(id){
        return request({
            url: '/part/part/list/partCategoryID',
            method: 'get',
            params:{
                id
            }
        })
    },
}
