import request from '@/utils/request-speech'

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

