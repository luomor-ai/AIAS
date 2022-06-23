<template>
 <div class="wrap">
  <el-form v-model="form">
   <el-form-item>
    <!--<el-button type="primary"
            @mousedown.native="mouseStart"
            @mouseup.native="mouseEnd"
            v-on:touchstart="mouseStart"
            v-on:touchend="mouseEnd"
            >{{ form.time }}</el-button>-->
    <el-button type="primary" @click="recOpen">打开录音,请求权限</el-button>
    <el-button type="primary" @click="recClose">关闭录音,释放资源</el-button>
    <el-button type="primary" @click="recStart">录制</el-button>
    <el-button type="primary" @click="recStop" style="margin-right:80px">停止</el-button>
    <el-divider />
    <span>{{ form.tip }}</span>
    <el-divider />
    <div class="ctrlProcessWave"></div>
    <audio
        v-if="form.audioUrl"
        :src="form.audioUrl"
        controls="controls"></audio>
   </el-form-item>
  </el-form>
 </div>
</template>
<script>
// 引入recorder.js
import recording from '@/utils/recorder.js'
import Recorder from 'recorder-core'
//需要使用到的音频格式编码引擎的js文件统统加载进来，这些引擎文件会比较大
import 'recorder-core/src/engine/mp3'
import 'recorder-core/src/engine/mp3-engine'

export default {
    data() {
        return {
            form: {
                time: '按住说话(60秒)',
                tip: '先打开录音，点击录制按钮开始说话',
                audioUrl: ''
            },
            num: 60, // 按住说话时间
            recorder: null,
            interval: '',
            audioFileList: [], // 上传语音列表
            startTime: '', // 语音开始时间
            endTime: '', // 语音结束
            Rec: Recorder,
            type: "mp3",
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
        // 清除定时器
        clearTimer() {
            if (this.interval) {
                this.num = 60
                clearInterval(this.interval)
            }
        },
        // 长按说话
        mouseStart() {
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
        mouseEnd() {
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
                    console.log(base64)
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
                    console.log(base64)
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
</style>