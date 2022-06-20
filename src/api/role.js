import request from '@/utils/request'

export default{ 
// 分页列表
    getList(searchMap, page = 1, size = 20) {
        return request({
            url: `system/role/search`,
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
            url: `system/role/option`,
            method: 'post',
            data
        })
    },
    getById(id){
        return request({
            url: 'system/role/option',
            method: 'get',
            params:{
                id
            }
        })
    },
    update(data){
        return request({
            url: `system/role/option`,
            method: 'put',
            data
        })
    },
    deleteById(id){
        return request({
            url: 'system/role/option',
            method: 'delete',
            params:{
                id
            }
        })
    },
    getMenuIdsByRoleId(id){
        return request({
            url: 'system/role/menu/ids',
            method: 'get',
            params:{
                id
            }
        })
    },
    saveRoleMenu(roleId,menuIds){
        return request({
            url: 'system/role/menu/save',
            method: 'post',
            data:{
                roleId,
                menuIds
            }
        })
    },
}
