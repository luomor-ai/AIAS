<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120">
      <el-form-item label="Online Wav">
        <el-input v-model="form.url" />
      </el-form-item>
      <el-row>
        <el-col :span="9">
          <el-form-item>
            <audio id="audio1" :src="form.url" controls="controls" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="">
            <json-viewer
              :value="form.result1"
              :expand-depth="3"
              copyable
              width="400px"
            />
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
        >语音识别</el-button>
      </el-form-item>
      <el-form-item>
        <el-divider />
      </el-form-item>
      <el-row>
        <el-col :span="9">
          <div>
            <audio :src="form.base64Audio" controls="controls" />
          </div>
          <el-form-item label="Local Wav">
            <el-upload
              ref="upload"
              name="audioFile"
              class="upload"
              :action="upload()"
              :on-preview="handlePreview"
              :on-change="handleChange"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              ::limit="1"
              accept=".wav"
              :show-file-list="false"
              :auto-upload="false"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button
                v-loading.fullscreen.lock="fullscreenLoading"
                style="margin-left: 10px;"
                type="success"
                size="small"
                element-loading-text="拼命加载中"
                @click="submitUpload"
              >上传</el-button>
              <div slot="tip" class="el-upload__tip">Audio format: Wav</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="">
            <json-viewer
              :value="form.result2"
              :expand-depth="3"
              copyable
              width="500px"
            />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>

<script>
import { speechAsr } from '@/api/speech'
import JsonViewer from 'vue-json-viewer'

export default {
  name: 'SpeechAsr',
  components: {
    JsonViewer
  },
  data() {
    return {
      fullscreenLoading: false,
      form: {
        // url: 'https://www.7otech.com/fire_000001.jpg',
        url: require('@/assets/zh.wav'),
        result1: '',
        result2: '',
        base64Audio: ''
      }
    }
  },
  methods: {
    upload() {
      return '/ocr/uploadAudio'
    },
    submitUpload() {
      this.fullscreenLoading = true
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handleChange(file) {
      console.log(file)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleSuccess(file) {
      console.log(file)
      this.form.base64Audio = file.data.base64Audio
      // this.form.result2 = file.results
      const audio1 = this.form.base64Audio.substring(this.form.base64Audio.indexOf(','))
      const data = {
        audio: audio1,
        audio_format: "wav",
        sample_rate: 16000,
        lang: "zh_cn",
        punc: 0,
      }
      speechAsr(JSON.stringify(data)).then(response => {
        this.fullscreenLoading = false
        this.form.result2 = response.result
      })
    },
    beforeUpload(file) {
      const pass = file.type === 'audio/wav'
      if (!pass) {
        this.$message.error('Audio format should be Wav!')
      }
      return pass
    },
    getBase64Image(img) {
      var canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)
      var dataURL = canvas.toDataURL('image/png')
      // return dataURL
      return dataURL.replace('data:image/png;base64,', '')
    },
    bufferToBase64 (buffer) {
        var bytes = new Uint8Array(buffer);
        var len = buffer.byteLength;
        var binary = "";
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    },
    loadSoundFile(url) {
      var that = this
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function (e) {
          var base64Audio = that.bufferToBase64(this.response); // this.response is an ArrayBuffer.

          const data = {
            audio: base64Audio,
            audio_format: "wav",
            sample_rate: 16000,
            lang: "zh_cn",
            punc: 0,
          }
          speechAsr(data).then(response => {
            that.fullscreenLoading = false
            that.form.result1 = response.result
          })
      };
      xhr.send();
    },
    onSubmit() {
      this.fullscreenLoading = true
      var audio = document.getElementById('audio1')
      this.loadSoundFile(audio.src)
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
