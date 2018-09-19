import { Component, OnInit, ViewEncapsulation, ViewChild , Renderer2, ElementRef} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import * as SimpleWebRTC from 'simplewebrtc';
import { UserService } from './../../../shared/services/user.service';
import { Location, DatePipe } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material';


import { Injector} from '@angular/core';
import { createCustomElement } from '@angular/elements';

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.scss']
})
export class LiveViewComponent implements OnInit {

  public room: string;
  public nick: string;
  public message: string;
  public webrtc: any;
  public user: any;
  public iconsClass = 'hidden';
  public hangupClass = 'hidden';
  public muteAudioClass = 'off';
  public muteVideoClass = 'off';
  public cam = 'videocam';
  public mic = 'mic';
  public messagess = [];
  @ViewChild('file') file;

  constructor ( private router: Router,
              private activatedRoute: ActivatedRoute,
              public userService: UserService,
              private location: Location,
              private dialog: MatDialog,
              private renderer: Renderer2) {

  }


  ngOnInit() {

       this.user = this.userService.user.profile.firstName;
       this.nick = this.user;
      // get the room from the URL
       this.room = window.location.pathname.replace('/course/', '');
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
      if (this.room) {
        this.webrtc.joinRoom(this.room);
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



 connectivityError = (peer: any) => {
      const connstate: any = document.querySelector('#container_' + this.webrtc.getDomId(peer) + ' .connectionstate');
      if (connstate) {
        connstate.innerText = 'Connection failed.';
      }
    }


 iceFailed = (peer: any) => {
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
    this.location.back();
  }

  SendFile = (video: any, peer: any) => {
      const from = typeof peer.nick !== 'undefined' ? peer.nick : peer.id;
      const remotes = document.getElementById('remotes');
      if (remotes) {

        const container = document.createElement('div');
        container.className = 'video-container';
        container.id = 'container_' + this.webrtc.getDomId(peer);
        const spanuser = document.createElement('div');
        spanuser.className = 'username';
        spanuser.innerHTML = peer.nick;
        // spanuser.setAttribute('style', 'text-align: center;width: 100%;');
        container.appendChild(spanuser);
        const uservideo = <any>document.createElement('div');
        uservideo.className = 'uservideo';
        container.id = 'container_' + this.webrtc.getDomId(peer);
        // video.setAttribute('style', ' height: 100%; width: 100%;');
        uservideo.appendChild(video);
        container.appendChild(uservideo);

        const fileinput: HTMLInputElement = this.file.nativeElement;

        fileinput.className = 'sendFile';
        const messages = document.getElementById('messages');
        // const filelist = document.createElement('p');
        // filelist.className = 'fileList';
        // messages.appendChild(filelist);
        fileinput.addEventListener('change', function() {
            fileinput.disabled = true;
            const file = fileinput.files[0];
            const sender = peer.sendFile(file);
            const item = document.createElement('div');
            item.className = 'sending';
            const span = document.createElement('span');
            span.className = 'filename';
            span.appendChild(document.createTextNode(file.name));
            item.appendChild(span);
            const sendProgress = document.createElement('progress');
            sendProgress.max = file.size;
            item.appendChild(sendProgress);
            // $('.sending').hide();
            sender.on('progress', function (bytesSent) {
                sendProgress.value = bytesSent;
            });

            sender.on('sentFile', function () {
                item.appendChild(document.createTextNode('sent'));

                fileinput.removeAttribute('disabled');
            });
            sender.on('complete', function () {
            });
            messages.appendChild(item);
        }, false);

        fileinput.disabled = false;
        remotes.appendChild(container);
            peer.on('fileTransfer', function ( metadata, receiver ) {
            const item = document.createElement('div');
            item.className = 'receiving';
            const span = document.createElement('span');
            span.className = 'filename';
            span.appendChild(document.createTextNode(metadata.name));
            item.appendChild(span);
            const receiveProgress = document.createElement('progress');
            receiveProgress.max = metadata.size;
            item.appendChild(receiveProgress);

             // $('.receiving').show();
            // item.setAttribute('style', 'display: none;');
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

             // $('#messages').append('<b class="sender" >' + peer.nick + ' </b> <br> ');
            // this.renderer.appendChild(messages, '<b class="sender" >' + peer.nick + ' </b> <br> ');
             messages.appendChild(item);
             // chat.appendChild(item);
                    });
      }

    }

  createdPeer = (peer: any) => {
      const remotes = document.getElementById('remotes');

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
                  this.webrtc.sendDirectlyToAll(this.room, 'nick', peer.nick);
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

   localStream = (stream: any) => {
     const video = stream.getVideoTracks()[0];
     const audio = stream.getAudioTracks()[0];
    }

   videoRemoved = (video: any, peer: any) => {
      const from = typeof peer.nick !== 'undefined' ? peer.nick : peer.id;
      const remotes = document.getElementById('remotes');
      const el = document.getElementById(peer ? 'container_' + this.webrtc.getDomId(peer) : 'localScreenContainer');
      if (remotes && el) {
        remotes.removeChild(el);
      }
    }

    postMessage = ( message ) => {
    // this.message.length > 0;
    const chatMessage = {
      username: this.nick,
      content: this.message,
      postedOn: new Date(),
    };
    this.webrtc.sendToAll('chat', chatMessage);
      this.messagess.push({
      username: this.nick,
      content: this.message,
      postedOn: new Date().toLocaleString('de-DE'),
    });
    this.message = '';
    }

    sendMessage = ( data ) => {
     if ( data.type === 'chat') {
             const message = data.payload;
             this.messagess.push(message);
               }
   }

}
