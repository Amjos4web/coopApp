<template>
  <div>
    <div class="row" v-show="camera.streaming">
      <div class="col-md-6 col-lg-6 col-sm-12 text-center">
        <div>
          <label> Select Camera</label> 
          <select class="form-control" @change="switchCamera($event)">
            <option v-for="c in cameraList" :key="c.deviceId" :value="c.deviceId">{{c.label}}</option>
          </select>
        </div>
        <video id="video" class="mt-20">
          stream not available...
        </video>
        <div class="mb-20">
          <button class="btn btn-success" @click.prevent="takePicture()">
            <i class="fa fa-camera"></i> Capture
          </button>
        </div>
        
        <canvas id="canvas" style="display:none"></canvas>
      </div>
      <div class="col-md-6 col-lg-6 col-sm-12 text-center">
        <div>
          <label>Snapshot</label> 
          <div class="form-control" style="visibility:hidden">
            &nbsp;
          </div>
        </div>
        <div id="snap-shot" class="mt-20">
          <img v-if="camera.snapshotURL" :src="camera.snapshotURL" alt="snapshot">
        </div>
      </div>
    </div>

    <div class="col-md-12 text-center mb-20" v-show="!camera.streaming">
      Initializing Camera...
    </div>
  </div>
  
</template>
<script>
  
  let video = null
  let canvas = null, snapshot = '', height = 0, width = 300, stream = null

  const CAMERA_STATE = {
    ON:1,
    OFF:0
  }

  let cameraState = CAMERA_STATE.OFF
  
  export default {
    name: 'photo-capture',
    props:{
      onOrOff:Boolean,
      savePicture:Function,
      snapshotSize:Object
    },

    data:()=>({
      cameraList:[],
      error:null,
      camera:{
        streaming : false,
        snapshotURL:null,
      }
    }),

    watch:{
      onOrOff(newOnOrOf){

        if(newOnOrOf){
          this.switchOnCamera(undefined, true)
        }
        else {
          this.switchOffCamera()
        }
      }//end state function
    },

    methods:{

      switchCamera(event){
        //stream.
        const deviceId = event.target.value

        if(deviceId){
          this.switchOffCamera()

          this.switchOnCamera({video:{deviceId}}, false)
        }
        
      },

      stopStreaming(){
        if(stream){
          stream.getTracks().forEach(track=>track.stop())
        }
      },

      switchOffCamera(){
        
        this.stopStreaming()
        
        if(this.$data.camera.streaming){
          //pause video
          video.pause()
        }//end if

        this.$data.camera = {
          streaming : false,
          snapshotURL:null,
        }
        cameraState = CAMERA_STATE.OFF
      },
      
      switchOnCamera(constraint={video:true}, enumerateCamera=false){

        if(!canvas || !video){
          this.error = new Error("canvas or video is null")
          return 
        }

        if(cameraState === CAMERA_STATE.ON) return

        cameraState = CAMERA_STATE.ON

        navigator.mediaDevices.getUserMedia(constraint)
        .then(s=>{
          //s.addTrack()
          s.getVideoTracks()[0].t;
          stream = s;
          //link to the video source 
          if(enumerateCamera){
            navigator.mediaDevices.enumerateDevices()
            .then(deviceInfos=>{
              let d = null;
              const cameraList = []

              for(let i = 0; i < deviceInfos.length; i++){
                d = deviceInfos[i];
                if(d.kind === 'videoinput'){
                  cameraList.push({deviceId:d.deviceId, label:d.label})
                }//end if
              }//end for loop

              this.$data.cameraList = cameraList
            })
            .catch(e=>this.$data.error = e);
          }//end if
          video.srcObject = s;
          video.play()
        })
        .catch(e=>this.$data.error = e)
        /**
         * The camera might not have finish initializing before
         * the user close the camera interface. So in other for me
         * to stop streaming I need to add this then to stop the streaming 
         * and switch of the camera
         */
        .then(()=>{
          if(cameraState === CAMERA_STATE.OFF){
            this.stopStreaming()
          }
        })
      },

      takePicture(){
        if(width && height){
          //create canvas
          const context = canvas.getContext("2d")
          //Draw an image of the video on the cnavas
          context.drawImage(video, 0, 0, width, height)
          //create image from the canvas
          this.$data.camera.snapshotURL = canvas.toDataURL('image/png')

          this.$props.savePicture(this.$data.camera.snapshotURL)
        }//end if
      },
    },

    mounted(){
      video = document.getElementById('video')
      canvas = document.getElementById('canvas')
      snapshot = document.getElementById('snap-shot')

      video.addEventListener("canplay", ()=>{
        //video.
        if(!this.$data.camera.streaming){
          width = this.$props.snapshotSize.width
          //set video canvas height
          height = video.videoHeight / (video.videoWidth / width);
          
          video.setAttribute('width', width);
          video.setAttribute('height', height);

          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);

          snapshot.style.height = height + "px"
          snapshot.style.width = width + "px"

          this.$data.camera.streaming = true;
        }
      }, false)//end addEventLister
    },//end mounted

    beforeDestroy(){
      //if the camera is on, when component is about to be destroyed
      //I need to switch off the camera
      if(this.$props.onOrOff){
        this.switchOffCamera()
      }//end if
    }//end method
  }//end default export
</script>