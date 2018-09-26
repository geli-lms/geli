import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as SimpleWebRTC from 'simplewebrtc';
import { UserService } from './../../../shared/services/user.service';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {DataSharingService} from '../../../shared/services/data-sharing.service';
import { Location} from '@angular/common';
import {SnackBarService} from '../../../shared/services/snack-bar.service';
import {TranslateService} from '@ngx-translate/core';
import * as RecordRTC from 'recordrtc';

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.scss']
})
export class LiveViewComponent implements OnInit {

  course: ICourse;
  public room: string;
  public nick: string;
  public message: string;
  public webrtc: any;
  public user: any;
  public iconsClass = 'hidden';
  public hangupClass = 'hidden';
  public muteAudioClass = 'off';
  public muteVideoClass = 'off';
  public muteVideoRecord = 'off';
  public cam = 'videocam';
  public mic = 'mic';
  public record = 'movie';
  public messages = [];
  public streams = [];
  public SentFiles = [];
  public filetestName: string;
  public progresse: string;
  public hrefdownload: string;
  public receivefileprogress: string;
  @ViewChild('file') file;
  @ViewChild('video') video;
  private stream: MediaStream;
  private recordRTC: any;
  public testmedia;

  constructor ( private router: Router,
              // private activatedRoute: ActivatedRoute,
              public userService: UserService,
              private location: Location,
              private snackBar: SnackBarService,
              private translate: TranslateService,
              // private dialog: MatDialog,
              private dataSharingService: DataSharingService) {

  }


  ngOnInit() {

       this.user = this.userService.user.profile.firstName;
       this.nick = this.user;
      // get the room from the URL
       // this.room = window.location.pathname.replace('/course/', '');
       this.course = this.dataSharingService.getDataForKey('course');
    // create our webrtc connection
      this.webrtc = new SimpleWebRTC({
      // the id/element dom element that will hold 'our' video
      localVideoEl: 'localVideo',
      // the id/element dom element that will hold remote videos
      remoteVideosEl: '',
      // immediately ask for camera access
      debug: false,
      autoAdjustMic: false,
      autoRequestMedia: true,
      detectSpeakingEvents: true,
      nick: this.user ,
    });
      this.setup();
  }

  setup() {
    const fileinput: HTMLInputElement = this.file.nativeElement;
    fileinput.className = 'sendFile';
    this.webrtc.on('readyToCall', () => {
      if (this.course._id) {
        this.webrtc.joinRoom(this.course._id);
      }
        // Send a chat message
    });

    this.webrtc.on('localStream', this.localStream);
    this.webrtc.on('localMediaError', (err: any) => {
      alert ('Can\'t get access to camera');
    });
    // a peer video has been added
    this.webrtc.on('videoAdded', this.SendFile);
    this.webrtc.connection.on('message', this.sendMessage);
    // a peer was removed
    this.webrtc.on('videoRemoved', this.videoRemoved);
    // local p2p/ice failure
    this.webrtc.on('iceFailed', this.iceFailed );
    // remote p2p/ice failure
    this.webrtc.on('connectivityError', this.connectivityError);
    // this.webrtc.on('channelMessage', this.postMessage);
    this.webrtc.on('createdPeer', this.createdPeer);
  }



 connectivityError (peer: any) {
      const connstate: any = document.querySelector('#container_' + this.webrtc.getDomId(peer) + ' .connectionstate');
      if (connstate) {
        connstate.innerText = 'Connection failed.';
      }
    }


 iceFailed (peer: any) {
      const connstate: any = document.querySelector('#container_' + this.webrtc.getDomId(peer) + ' .connectionstate');
      if (connstate) {
        connstate.innerText = 'Connection failed.';
      }
    }


  toggleLocalAudio() {
         if ( this.muteAudioClass === 'on') {
         this.muteAudioClass = 'off';
         this.webrtc.unmute ();
         this.mic = 'mic';
      } else {
         this.muteAudioClass = 'on';
         this.webrtc.mute ();
         this.mic = 'mic_off';
      }
  }

   toggleLocalVideo() {
         if (this.muteVideoClass === 'on') {
         this.muteVideoClass = 'off';
         this.webrtc.resumeVideo ();
         this.cam = 'videocam';
      } else {
         this.muteVideoClass = 'on';
         this.webrtc.pauseVideo ();
         this.cam = 'videocam_off';
      }
  }

  leave() {
    this.webrtc.stopLocalVideo();
    this.webrtc.leaveRoom();
        this.translate.get(['virtual.LeaveRoom']).subscribe((t: string) => {
          this.snackBar.open(t['virtual.LeaveRoom']);
       });
    this.location.back();
  }


SendFile = (video: any, peer: any) => {
      this.translate.get(['virtual.messagesend', 'common.dismiss']).subscribe((t: string) => {
          this.snackBar.open(t['virtual.NewUserInRoom']);
        });
      const remotes = document.getElementById('remotes');
      // this.testmedia=peer.videoEl.captureStream();
      this.testmedia = peer.videoEl;
      // this.streams.push(peer.pc.getRemoteStreams());
      this.streams.push(peer.videoEl);
      // console.log('remotestream',peer.videoEl);
      // console.log('testmedia',this.testmedia);
      // console.log('remote stream',this.streams.length);
      // console.log('remote videooooooooooo',peer.pc.getRemoteStreams());

      remotes.appendChild(peer.videoEl);
      if (remotes) {
        /*
        const container = document.createElement('div');
        container.className = 'video-container';
        container.id = 'container_' + this.webrtc.getDomId(peer);
        const spanuser = document.createElement('div');
        spanuser.className = 'username';
        spanuser.innerHTML = peer.nick;

        container.appendChild(spanuser);
        const uservideo = <any>document.createElement('div');
        uservideo.className = 'uservideo';
        container.id = 'container_' + this.webrtc.getDomId(peer);

        uservideo.appendChild(video);
        container.appendChild(uservideo);

         */

        const fileinput: HTMLInputElement = this.file.nativeElement;

        fileinput.className = 'sendFile';
        const messages = document.getElementById('messages');
        fileinput.addEventListener('change', function() {

                  const files = fileinput.files[0];
                      const sender = peer.sendFile(files);
                      sender.on('progress', function(offset, fileSize, result) {
                        // TODO
                      });
                      sender.on('sentFile', function() {
                        // TODO
                      });

        }, false);


        fileinput.disabled = false;
        // remotes.appendChild(container);
            peer.on('fileTransfer', function ( metadata, receiver ) {
            const item = document.createElement('div');
            item.className = 'receiving';
            const span = document.createElement('span');
            span.className = 'filename';
            span.appendChild(document.createTextNode(metadata.name));

            this.filetestName = metadata.name;
            item.appendChild(span);
            const receiveProgress = document.createElement('progress');
            receiveProgress.max = metadata.size;
            this.receivefileprogress = metadata.size;
            item.appendChild(receiveProgress);

            receiver.on('progress', function (bytesReceived) {
                receiveProgress.value = bytesReceived;
            });

            receiver.on('receivedFile', function (file) {
                const href = document.createElement('a');
                href.href = URL.createObjectURL(file);
                href.download = metadata.name;
                href.appendChild(document.createTextNode('download'));
                item.appendChild(href);
                receiver.channel.close();
            });
             messages.appendChild(item);
                    });

      }

    }

  createdPeer (peer: any) {
      const remotes = document.getElementById('remotes');

      // console.log('the connected peers are ',this.webrtc.getPeers())

      if (!remotes) {
        return;
      }
        if (peer && peer.pc) {
          const connstate = document.createElement('div');
          peer.pc.on('iceConnectionStateChange', function (event: any) {
            switch (peer.pc.iceConnectionState) {
              case 'checking':
                connstate.innerText = peer.nick;
                break;
              case 'connected':
              case 'completed':
                connstate.innerText = peer.nick ;
                if (this.nick !== this.user) {
                  this.webrtc.sendDirectlyToAll(this.course._id, 'nick', peer.nick);
                }
                break;
              case 'disconnected':
                connstate.innerText = 'Disconnected.';
                break;
              case 'failed':
                connstate.innerText = 'Connection failed.';
                break;
              case 'closed':
                connstate.innerText = 'Connection closed.';
                break;
            }
          });
        }
    }

   localStream (stream: any) {
     const video = stream.getVideoTracks()[0];
     const audio = stream.getAudioTracks()[0];
    }

   videoRemoved = (video: any, peer: any) => {
      const remotes = document.getElementById('remotes');
      const el = document.getElementById(peer ? 'container_' + this.webrtc.getDomId(peer) : 'localScreenContainer');
      if (remotes && el) {
        remotes.removeChild(el);
      }
    }

    postMessage ( message ) {
    // this.message.length > 0;
    if (this.message !== '') {

      // code...
           const objDiv = document.getElementById('chat');
          const chatMessage = {
            username: this.nick,
            content: this.message,
            postedOn: new Date(),
          };
          this.webrtc.sendToAll('chat', chatMessage);
            this.messages.push({
            username: this.nick,
            content: this.message,
            postedOn: new Date().toLocaleString('de-DE'),
          });
          this.message = '';
          objDiv.scrollTop = objDiv.scrollHeight;
          }
          // this.snackBar.open('Message send');
        this.translate.get(['virtual.messagesend', 'common.dismiss']).subscribe((t: string) => {
          this.snackBar.open(t['virtual.messagesend']);
        });

    }



    sendMessage = ( data ) => {
     if ( data.type === 'chat') {
             const message = data.payload;
             this.messages.push(message);
               }
   }

   toggleControls() {

  document.getElementById('localVideo');
    const video: HTMLVideoElement = this.video.nativeElement;
  }

    successCallback(stream: MediaStream) {
    const options = {
      mimeType : 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
      // mimeType: 'video/webm\;codecs=h264',
      audioBitsPerSecond : 128000,
      videoBitsPerSecond : 128000,
      bitsPerSecond : 128000 //
    };
    this.stream = stream;
    this.recordRTC = RecordRTC(stream, options);
    this.recordRTC.startRecording();
    const video: HTMLVideoElement = this.video.nativeElement;
    video.src = window.URL.createObjectURL(stream);
    this.toggleControls();
  }

    errorCallback() {
    // console.log('error');
  }

    processVideo(audioVideoWebMURL) {
    const video: HTMLVideoElement = this.video.nativeElement;
    const recordRTC = this.recordRTC;
    video.src = audioVideoWebMURL;
    this.toggleControls();
    const recordedBlob = recordRTC.getBlob();
    recordRTC.getDataURL(function (dataURL) { });
  }

    startRecording() {
     const mediaConstraints = {
      video: {
        mandatory: {
          minWidth: 1280,
          minHeight: 720
        }
      }, audio: true
    };
    navigator.mediaDevices
      .getUserMedia({video : true, audio : true})
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

    stopRecording() {
    const recordRTC = this.recordRTC;
    recordRTC.stopRecording();
  }

   download() {
    const recordRTC = this.recordRTC;
    recordRTC.stopRecording();
    this.recordRTC.save('video.webm');
    // this.recordRTC.save('video.mp4')/*('video.mp4')*/;
  }

     toggleLocalRecord() {
         if (this.muteVideoRecord === 'on') {
         this.muteVideoRecord = 'off';
         this.startRecording();
         this.record = 'videocam';
      } else {
         this.muteVideoClass = 'on';
         this.muteVideoRecord = 'off';
         this.download ();
         this.record = 'file-video';
      }
  }

}
