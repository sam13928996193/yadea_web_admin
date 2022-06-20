import request from '@/utils/request'

export default{ 
// 列表
    getList(searchMap,page) {
        return request({
            url: `system/menu/search`,
            method: 'post',
            data:{
                ...searchMap
            }
        })
    },
    add(data){
        return request({
            url: `system/menu/option`,
            method: 'post',
            data
        })
    },
    getById(id){
        return request({
            url: `system/menu/option`,
            method: 'get',
            params:{
                id
            }
        })
    },
    update(data){
        return request({
            url: `system/menu/option`,
            method: 'put',
            data
        })
    },
    deleteById(id){
        return request({
            url: `system/menu/option`,
            method: 'delete',
            params:{
                id
            }
        })
    }
}
