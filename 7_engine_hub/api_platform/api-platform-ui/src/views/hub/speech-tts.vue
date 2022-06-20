<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120">
      <el-form-item label="Online Wav">
        <el-input type="textarea" v-model="form.text" />
      </el-form-item>
      <el-row>
        <el-col :span="9">
          <el-form-item>
            <audio id="audio1" :src="form.base64Audio" controls="controls" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button
          v-loading.fullscreen.lock="fullscreenLoading"
          type="primary"
          size="small"
          element-loading-text="拼命加载中"
          @click="onSubmit"
        >语音合成</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { speechTts } from '@/api/speech'

export default {
  name: 'SpeechTts',
  components: {

  },
  data() {
    return {
      fullscreenLoading: false,
      form: {
        text: '您好，欢迎使用语音合成服务。',
        base64Audio: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.fullscreenLoading = true
      const data = {
         "text": this.form.text,
         "spk_id": 0,
         "speed": 1.0,
         "volume": 1.0,
         "sample_rate": 0,
         "save_path": "./tts.wav"
     }
      speechTts(data).then(response => {
        this.fullscreenLoading = false
        this.form.base64Audio = 'data:audio/wav;base64,' + response.result.audio
      })
    }
  }
}
</script>

<style scoped>
  .el-input {
    width: 600px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  .line {
    text-align: center;
  }
</style>
