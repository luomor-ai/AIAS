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

      <el-form-item>
        <el-divider />
      </el-form-item>

      <el-row>
        <el-col :span="9">
            <!--<el-button type="primary"
                @mousedown.native="mouseStart"
                @mouseup.native="mouseEnd"
                v-on:touchstart="mouseStart"
                v-on:touchend="mouseEnd"
                >{{ form.time }}</el-button>-->
            <el-button type="primary" @click="recOpen">打开录音,请求权限</el-button>
            <p />
            <el-button type="primary" @click="recClose">关闭录音,释放资源</el-button>
            <p />
            <el-button type="primary" @click="recStart">录制</el-button>
            <p />
            <el-button type="primary" @click="recStop" style="margin-right:80px">停止</el-button>
            <p />
            <span>{{ form.tip }}</span>
            <p />
            <audio
                v-if="form.audioUrl"
                :src="form.audioUrl"
                controls="controls"></audio>
        </el-col>
        <el-col :span="12">
          <el-form-item label="">
            <json-viewer
              :value="form.result3"
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
import recording from '@/utils/recorder.js'
import Recorder from 'recorder-core'
import 'recorder-core/src/engine/wav'

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
        base64Audio: '',
        time: '按住说话(60秒)',
        tip: '先打开录音，点击录制按钮开始说话',
        audioUrl: '',
        result3: ''
      },
      num: 60, // 按住说话时间
      recorder: null,
      interval: '',
      audioFileList: [], // 上传语音列表
      startTime: '', // 语音开始时间
      endTime: '', // 语音结束
      Rec: Recorder,
      type: "wav",
      bitRate: 16,
      sampleRate: 16000,
      rec: 0,
      duration: 0,
      powerLevel: 0,
      recOpenDialogShow: 0,
      logs: []
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
      const audio1 = this.form.base64Audio.substring(this.form.base64Audio.indexOf(',') + 1)
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
    },
    // 清除定时器
    clearTimer () {
        if (this.interval) {
            this.num = 60
            clearInterval(this.interval)
        }
    },
    // 长按说话
    mouseStart () {
        this.clearTimer()
        this.startTime = new Date().getTime()
        recording.get((rec) => {
            // 当首次按下时，要获取浏览器的麦克风权限，所以这时要做一个判断处理
            if (rec) {
                // 首次按下，只调用一次
                if (this.flag) {
                    this.mouseEnd()
                    this.flag = false
                } else {
                    this.recorder = rec
                    this.interval = setInterval(() => {
                        if (this.num <= 0) {
                            this.recorder.stop()
                            this.num = 60
                            this.clearTimer()
                        } else {
                            this.num--
                            this.form.time = '松开结束（' + this.num + '秒）'
                            this.recorder.start()
                        }
                    }, 1000)
                }
            }
        })
    },
    // 松开时上传语音
    mouseEnd () {
        let that = this;
        this.clearTimer()
        this.endTime = new Date().getTime()
        if (this.recorder) {
            this.recorder.stop()
            // 重置说话时间
            this.num = 60
            this.form.time = '按住说话（' + this.num + '秒）'
            // 获取语音二进制文件
            let blob = this.recorder.getBlob()
            console.log(blob.arrayBuffer());
            // 将获取的二进制对象转为二进制文件流
            let file = new File([blob], 'test.mp3', {type: 'audio/mp3', lastModified: Date.now()})
            console.log(file)
            this.form.audioUrl = window.URL.createObjectURL(blob);
            let fr = new FileReader();
            fr.onloadend = function (e) {
                let base64 = e.target.result;
                const audio1 = base64.substring(base64.indexOf(',') + 1)
                const data = {
                    audio: audio1,
                    audio_format: "mp3",
                    sample_rate: 16000,
                    lang: "zh_cn",
                    punc: 0,
                }
                that.fullscreenLoading = true
                speechAsr(JSON.stringify(data)).then(response => {
                    that.fullscreenLoading = false
                    that.form.result3 = response.result
                })
            };
            fr.readAsDataURL(blob);
            let fd = new FormData()
            fd.append('file', file)
            // 这里是通过上传语音文件的接口，获取接口返回的路径作为语音路径
            console.log(fd)
            // this.uploadFile(fd)
        }
    },
    recOpen: function () {
        var This = this;
        var rec = this.rec = Recorder({
            type: This.type
            , bitRate: This.bitRate
            , sampleRate: This.sampleRate
            , onProcess: function (buffers, powerLevel, duration, sampleRate) {
                This.duration = duration;
                This.powerLevel = powerLevel;
            }
        });
        This.dialogInt = setTimeout(function () {//定时8秒后打开弹窗，用于监测浏览器没有发起权限请求的情况

        }, 8000);
        rec.open(function () {
            console.log("已打开:" + This.type + " " + This.sampleRate + "hz " + This.bitRate + "kbps", 2);

        }, function (msg, isUserNotAllow) {
            console.log((isUserNotAllow ? "UserNotAllow，" : "") + "打开失败：" + msg, 1);
        });
        This.waitDialogClickFn = function () {
            console.log("打开失败：权限请求被忽略，用户主动点击的弹窗", 1);
        };
    },
    recClose: function () {
        var rec = this.rec;
        this.rec = null;
        if (rec) {
            rec.close();
            console.log("已关闭");
        } else {
            console.log("未打开录音", 1);
        }
        ;
    },
    recStart: function () {
        if (!this.rec || !Recorder.IsOpen()) {
            console.log("未打开录音", 1);
            return;
        }
        this.rec.start();
        var set = this.rec.set;
        console.log("录制中：" + set.type + " " + set.sampleRate + "hz " + set.bitRate + "kbps");
    },
    recPause: function () {
        if (this.rec && Recorder.IsOpen()) {
            this.rec.pause();
        } else {
            console.log("未打开录音", 1);
        }
        ;
    },
    recResume: function () {
        if (this.rec && Recorder.IsOpen()) {
            this.rec.resume();
        } else {
            console.log("未打开录音", 1);
        }
        ;
    },
    recStop: function () {
        if (!(this.rec && Recorder.IsOpen())) {
            console.log("未打开录音", 1);
            return;
        }

        var This = this;
        var rec = This.rec;
        rec.stop(function (blob, duration) {
            console.log("已录制:", "", {
                blob: blob
                , duration: duration
                , rec: rec
            });
            This.form.audioUrl = window.URL.createObjectURL(blob);
            let fr = new FileReader();
            fr.onloadend = function (e) {
                let base64 = e.target.result;
                console.log(base64);
                const audio1 = base64.substring(base64.indexOf(',') + 1)
                const data = {
                    audio: audio1,
                    audio_format: "mp3",
                    sample_rate: 16000,
                    lang: "zh_cn",
                    punc: 0,
                }
                This.fullscreenLoading = true
                speechAsr(JSON.stringify(data)).then(response => {
                    This.fullscreenLoading = false
                    This.form.result3 = response.result
                })
            };
            fr.readAsDataURL(blob);
        }, function (s) {
            console.log("录音失败：" + s, 1);
        });
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
