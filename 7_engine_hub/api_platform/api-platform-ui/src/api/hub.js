import request from '@/utils/request'

export function fireSmokeDetectPaddle(data) {
  return request({
    url: '/predict/fire-smoke-detect-paddle',
    method: 'post',
    params: data
  })
}

export function helmetDetection(data) {
  return request({
    url: '/predict/helmet-detection',
    method: 'post',
    params: data
  })
}
