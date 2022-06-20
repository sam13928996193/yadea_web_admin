import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/system/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/system/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/system/user/logout',
    method: 'post'
  })
}

// 多条件分页查询用户列表
export function getList(query, page = 1, size = 10) {
  return request({
    url: '/system/user/search',
    method: 'post',
    data:{...query, page, size}
  })
}

export function add(data){
  return request({
      url: `/system/user/option`,
      method: 'post',
      data
  })
}


export function getById(id){
  return request({
      url: 'system/user/option',
      method: 'get',
      params:{
          id
      }
  })
}
export function update(data){
  return request({
      url: `system/user/option`,
      method: 'put',
      data
  })
}
export function deleteById(id){
  return request({
      url: 'system/user/option',
      method: 'delete',
      params:{
          id
      }
  })
}
// 根据用户id，查询拥有的角色
export function getRoleIdsByUserId(id){
  return request({
      url: 'system/user/role/ids',
      method: 'get',
      params:{
          id
      }
  })
}

export function saveUserRole(userId,roleIds){
  return request({
      url: 'system/user/role/save',
      method: 'post',
      data:{
          userId,
          roleIds
      }
  })
}

export function updateUserPwd(data){
  return request({
      url: 'system/user/update/password',
      method: 'put',
      data
  })
}