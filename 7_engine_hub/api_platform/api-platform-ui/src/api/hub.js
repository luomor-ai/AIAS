import request from '@/utils/request-hub'

export function fireSmokeDetectPaddle(data) {
  return request({
    url: '/predict/fire-smoke-detect-paddle',
    method: 'post',
    data
  })
}

export function helmetDetection(data) {
  return request({
    url: '/predict/helmet-detection',
    method: 'post',
    data
  })
}

export function speechAsr(data) {
  return request({
    url: '/speech/asr',
    method: 'post',
    data
  })
}

export function speechTts(data) {
  return request({
    url: '/speech/tts',
    method: 'post',
    data
  })
}

