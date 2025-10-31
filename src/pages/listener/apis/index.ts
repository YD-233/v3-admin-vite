import { request } from "@/http/axios"

// 监听器数据类型定义
export interface ListenerData {
  uuid?: string
  name: string
  description: string
  listenAddress: string
  externalAddress: string
  heartBeatTime: number
  timeout: number
  isEnable: boolean
}

// 创建监听器请求参数
export interface CreateListenerRequest {
  name: string
  description: string
  listenAddress: string
  externalAddress: string
  heartBeatTime: number
  timeout: number
  isEnable: boolean
}

// 获取所有HTTPS监听器
export function getHttpsListeners() {
  return request<ListenerData[]>({
    url: "/api/listener/https",
    method: "get"
  })
}

// 创建新的HTTPS监听器
export function createHttpsListener(data: CreateListenerRequest) {
  return request<ListenerData>({
    url: "/api/listener/https",
    method: "post",
    data
  })
}

// 删除指定的HTTPS监听器
export function deleteHttpsListener(uuid: string) {
  return request({
    url: `/api/listener/https/${uuid}`,
    method: "delete"
  })
}

// 切换HTTPS监听器的启用状态
export function changeHttpsListenerStatus(uuid: string) {
  return request<ListenerData>({
    url: `/api/listener/https/${uuid}/status`,
    method: "put"
  })
}
