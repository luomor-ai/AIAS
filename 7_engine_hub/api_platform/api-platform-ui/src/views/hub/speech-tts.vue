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
    JsonViewer
  },
  data() {
    return {
      fullscreenLoading: false,
      form: {
        // url: 'https://www.7otech.com/fire_000001.jpg',
        url: require('@/assets/00000.jpg'),
        result1: '',
        result2: '',
        base64Img: ''
      }
    }
  },
  methods: {
    upload() {
      return '/ocr/uploadImage'
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
      this.form.base64Img = file.data.base64Img
      // this.form.result2 = file.results
      const img1 = this.form.base64Img.substring(this.form.base64Img.indexOf(','))
      const data = {
        images: [img1]
      }
      oralDetection(JSON.stringify(data)).then(response => {
        this.fullscreenLoading = false
        this.form.result2 = response.results
      })
    },
    beforeUpload(file) {
      const pass = file.type === 'image/jpg' || 'image/jpeg' || 'image/png'
      if (!pass) {
        this.$message.error('Image format should be JPG(JPEG) or PNG!')
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
    onSubmit() {
      this.fullscreenLoading = true
      var img = document.getElementById('img1')
      const img1 = this.getBase64Image(img)
      const data = {
        images: [img1]
      }
      oralDetection(data).then(response => {
        this.fullscreenLoading = false
        this.form.result1 = response.results
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
