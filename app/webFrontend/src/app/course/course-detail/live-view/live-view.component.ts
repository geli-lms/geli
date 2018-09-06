import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import * as $ from 'jquery';
import * as SimpleWebRTC from 'simplewebrtc';
import { UserService } from './../../../shared/services/user.service';
import { Location, DatePipe } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material';

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.scss']
})
export class LiveViewComponent implements OnInit {
  public room: string;
  public nick: string;
  public webrtc: any;
  public user: any;
  public stream: MediaStream;
  @ViewChild('video') video;
  @ViewChild('file') file;
  public iconsClass = 'hidden';
  public hangupClass = 'hidden';
  public muteAudioClass = 'off';
  public muteVideoClass = 'off';
  public messages = [];
  public message: string;
  cam = 'videocam';
  mic = 'mic';
  today = Date.now();
  datePipe = new DatePipe('en-US');
  myFormattedDate = this.datePipe.transform( this.today, 'short');

  constructor ( private router: Router,
              private activatedRoute: ActivatedRoute,
              public userService: UserService,
              private location: Location,
              private dialog: MatDialog) {

  }

  ngOnInit() {
       this.user = this.userService.user.profile.firstName;
       this.nick = this.user;
       this.room = window.location.pathname.replace('/course/', '');
       this.setup();
  }

  setup() {
      const self = this;
      self.webrtc = new SimpleWebRTC ( {
      localVideoEl: 'localVideo' ,
      remoteVideosEl: '' ,
      debug: false ,
      autoAdjustMic: false ,
      autoRequestMedia: true ,
      detectSpeakingEvents: true ,
      nick: this.user ,
    });
     const fileinput: HTMLInputElement = this.file.nativeElement;

    fileinput.className = 'sendFile';
    self.webrtc.on('readyToCall', function () {
      if (self.room) {
        self.webrtc.joinRoom(self.room);
        self.webrtc.getPeers();
      }
    });
     self.webrtc.connection.on('message', function(data) {
     if ( data.type === 'chat') {
        $('#messages').append ('<li style="width:100%; float:left;">' +
          ' <i class="material-icons" style = "color : blue;float:left;">person</i>' +
          ' <b>' + data.payload.nick + '&nbsp &nbsp' + data.payload.date + ' </b> <br> ' +
          '<span style = "color : black; padding: 3px 10px;float:left;">' +
          data.payload.message + '</span>');
     }
   });
    self.webrtc.on('localStream', function (stream: any) {
      const video = stream.getVideoTracks()[0];
      const audio = stream.getAudioTracks()[0];
    });


    self.webrtc.on('localMediaError', function (err: any) {
      alert ('Can\'t get access to camera');
    });

    self.webrtc.on('videoAdded', function (video: any, peer: any) {
      const addedpeer = peer.nick;
      this.peer = peer;
      $('#messages').append('<b>' + peer.nick + '</b>' + '&nbsp' + 'online');
      const remotes = document.getElementById ('remotes');

      if (remotes) {
        const container = <any>document.createElement ('div');
        container.className = 'kvc-video-container';
        container.setAttribute('style', 'margin:10px ; height: 30%; width: 30%;border: 1px solid blue;');
        const spanuser = document.createElement('div');
        spanuser.className = 'username';
        spanuser.innerHTML = peer.nick;
        spanuser.setAttribute('style', 'text-align: center;width: 100%;');
        container.appendChild(spanuser);
        const uservideo = <any>document.createElement('div');
        uservideo.className = 'uservideo';
        container.id = 'container_' + self.webrtc.getDomId(peer);
        video.setAttribute('style', ' height: 100%; width: 100%;');
        uservideo.appendChild(video);
        container.appendChild(uservideo);

        const chat__main = document.getElementById('chat__main');
        const chat__footer = document.getElementById('chat__footer');
        const messages = document.getElementById('messages');
        const filelist = document.createElement('p');
        filelist.className = 'fileList';
        messages.appendChild(filelist);
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
            $('.sending').hide();
            sender.on('progress', function (bytesSent) {
                sendProgress.value = bytesSent;
            });
            // sendFile
            sender.on('sendFile', function () {
                item.appendChild(document.createTextNode('sent'));

                fileinput.removeAttribute('disabled');
            });
            sender.on('complete', function () {
            });
            messages.appendChild(item);
        }, false);

        fileinput.disabled = false;
        if (peer && peer.pc) {
          const connstate = document.createElement('div');
          peer.pc.on('iceConnectionStateChange', function (event: any) {
            switch (peer.pc.iceConnectionState) {
              case 'checking':
                connstate.innerText = self.nick;
                break;
              case 'connected':
              case 'completed':
                connstate.innerText = peer.nick ;
                if (self.nick !== this.user) {
                  self.webrtc.sendDirectlyToAll(self.room, 'nick', self.nick);
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
        remotes.appendChild(container);

        peer.on('fileTransfer', function ( metadata, receiver ) {
            const item = document.createElement('div');
            const htmlcode = '<i class="material-icons" style = "color : blue;float:left;"> person </i>' +
            ' <b>' + peer.nick + ' </b>' + ' <br> ';
            item.className = 'receiving';
            const span = document.createElement('span');
            span.className = 'filename';
            span.appendChild(document.createTextNode(metadata.name));
            item.appendChild(span);
            const receiveProgress = document.createElement('progress');
            receiveProgress.max = metadata.size;
            item.appendChild(receiveProgress);

            $('.receiving').show();
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
            $('#messages').append('<li style="width:100%; float:left;">' +
              '<i class="material-icons" style = "color : blue;float:left;">person</i>' +
              ' <b style = "color : black;float:left;">' + peer.nick + ' </b> <br> ');
            messages.appendChild(item);
        });
      }
    });

    self.webrtc.on('videoRemoved', function (video: any, peer: any) {
      const peerleave = peer.nick + ' &nbsp &nbsp' + 'offline';
      $('#messages').append('<h4 class="user" style="color:red">' + peerleave + '</h4>');
      const remotes = document.getElementById('remotes');
      const el = document.getElementById(peer ? 'container_' + self.webrtc.getDomId(peer) : 'localScreenContainer');
      if (remotes && el) {
        remotes.removeChild ( el);
      }
    });

    self.webrtc.on('iceFailed', function (peer: any) {
      const connstate: any = document.querySelector('#container_' + self.webrtc.getDomId(peer) + ' .connectionstate');
      if ( connstate) {
        connstate.innerText = 'Connection failed.';
      }
    });

    self.webrtc.on('connectivityError', function (peer: any) {
      const connstate: any = document.querySelector('#container_' + self.webrtc.getDomId(peer) + ' .connectionstate');
      if ( connstate) {
        connstate.innerText = 'Connection failed.';
      }
    });
  }
    pushNotification(event: any, peer1: any): void {
    const videoAdded: any = {
      'message': peer1 + ' has joined the room',
      'color': 'green'
    };
    const videoRemoved: any = {
      'message': peer1 + ' has left the room',
      'color': 'red'
    };
  }

  toggleAudioMute () {
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

    toggleVideoMute () {
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

   hangup () {
    this.webrtc.stopLocalVideo();
    this.webrtc.leaveRoom();
    this.location.back();
   }

   send () {
   if ($('#text').val() !== '') {
   const msg = $('#text').val();
   this.webrtc.sendToAll('chat', { message : msg, nick : this.nick, date : this.myFormattedDate});
    $('#messages').append('<li style = "width:100%; float:left;">' +
      '<i class="material-icons" style = "color : blue ; float:left;"> person </i>' +
      ' <b style = "color : black;float : left;">' + this.nick + ' &nbsp &nbsp' +
      this.myFormattedDate + ' </b> <br> ' +
      '<span style = "color :black; padding: 3px 10px;float:left;">' + msg + '</span>');
    $('#chat__main').animate( {
     scrollTop: $('#chat__main').get(0).scrollHeight}, 2000);
    $('#text').val('');
 }
}

}
