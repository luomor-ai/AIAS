<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120">
      <el-form-item label="Online Image">
        <el-input v-model="form.url" />
      </el-form-item>
      <el-row>
        <el-col :span="9">
          <el-form-item>
            <img id="img1" :src="form.url" width="400px">
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
        >烟火检测</el-button>
      </el-form-item>
      <el-form-item>
        <el-divider />
      </el-form-item>
      <el-row>
        <el-col :span="9">
          <div>
            <img :src="form.base64Img" width="400px" class="avatar">
          </div>
          <el-form-item label="Local Image">
            <el-upload
              ref="upload"
              name="imageFile"
              class="upload"
              :action="upload()"
              :on-preview="handlePreview"
              :on-change="handleChange"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              ::limit="1"
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
              <div slot="tip" class="el-upload__tip">Image format: JPG(JPEG), PNG</div>
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
import { fireSmokeDetectPaddle } from '@/api/hub'
import JsonViewer from 'vue-json-viewer'

export default {
  name: 'FireSmokeDetect',
  components: {
    JsonViewer
  },
  data() {
    return {
      fullscreenLoading: false,
      form: {
        // url: 'https://www.7otech.com/fire_000001.jpg',
        url: require('@/assets/fire_000001.jpg'),
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
      fireSmokeDetectPaddle(JSON.stringify(data)).then(response => {
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
      fireSmokeDetectPaddle(data).then(response => {
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
