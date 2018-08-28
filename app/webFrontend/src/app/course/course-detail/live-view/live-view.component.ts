import { Component, OnInit, ViewEncapsulation,ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {FileUploader, FileUploaderOptions} from 'ng2-file-upload';
import * as $ from 'jquery';
import * as SimpleWebRTC from 'simplewebrtc';
import {UserService} from './../../../shared/services/user.service';
import { Location,DatePipe } from '@angular/common';
import {MatDialog,
  MatDialogConfig} from '@angular/material';

import * as RecordRTC from 'recordrtc';

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.scss']
})
export class LiveViewComponent implements OnInit {

  public room: string;
  public nick: string;
  public webrtc: any;
  public user:any;
  private stream: MediaStream;
  @ViewChild('video') video;

  @ViewChild('file') file;

  //@ViewChild('volumerange')volumeElement;


   public iconsClass = "hidden";
   public hangupClass = "hidden";
   public muteAudioClass = "off";
   public muteVideoClass = "off";

   private messages = [];
   private message: string;

   cam='videocam';

   mic='mic';
   newpeer;
   //private allClients : any []= [];
   allClients:string[] = [];

   today= Date.now();
   datePipe=new DatePipe('en-US');

   myFormattedDate = this.datePipe.transform(this.today, 'short');

   peers;

   peer;
   
  constructor(    private router: Router,
    private activatedRoute: ActivatedRoute,
    public userService: UserService,
    private location: Location,
    private dialog: MatDialog,
    ) { }

  ngOnInit() {
  	   this.user=this.userService.user.profile.firstName;
       const self = this;
       this.nick=this.user;
    self.room = window.location.pathname.replace('/course/', '');
    console.log('the room is',self.room);
    
    self.webrtc = new SimpleWebRTC({
      
      localVideoEl: 'localVideo',
      
      remoteVideosEl: '',

      debug: false,
      autoAdjustMic: false,
      autoRequestMedia: true,
      detectSpeakingEvents: true,
      nick: this.user,
    });

    let video:HTMLVideoElement = this.video.nativeElement;
    let fileinput:HTMLInputElement = this.file.nativeElement;
    //fileinput.type = 'file';
    fileinput.className='sendFile';

    
    self.webrtc.on('readyToCall', function () {
      
      if (self.room) {
        self.webrtc.joinRoom(self.room); 
        self.webrtc.getPeers()
      }


    });



     self.webrtc.connection.on('message', function(data){
     console.log("Received");
     if(data.type === 'chat'){
         console.log('chat received',data.payload.message);
        $('#messages').append("<li style='width:100%; float:left;'>"+"<i class='material-icons' style = 'color : blue;float:left;'>person</i>"+" <b>"+data.payload.nick +' &nbsp &nbsp'+data.payload.date+" </b> <br> "+"<span style = 'color : black; padding: 3px 10px;float:left;'>" + data.payload.message + '</span>');
     }
   });
    
    self.webrtc.on('localStream', function (stream: any) {
      
      const video = stream.getVideoTracks()[0];
      const audio = stream.getAudioTracks()[0];
      /*
      document.getElementById("localVolume").style.display = "block";
      const player       : HTMLInputElement =<HTMLInputElement> document.getElementById('localVideo');
      // Update the video volume
      const volumeBar    : HTMLInputElement =<HTMLInputElement> document.getElementById('volume-bar');
        volumeBar.addEventListener("change", function() {
          self.webrtc.volume = volumeBar.value;
        });

        */

    });

    // we did not get access to the camera
    self.webrtc.on('localMediaError', function (err: any) {
      alert('Can\'t get access to camera');
    });

    // a peer video has been added
    //var filleinput = document.createElement('input');
    //const chat__main = document.getElementById('chat__main');
    //chat__main.appendChild(fileinput);
    self.webrtc.on('videoAdded', function (video: any, peer: any) {
      this.newpeer=  peer.nick +' ist wieder online';
      const addedpeer=peer.nick;

      this.peer=peer;
      console.log('video added', peer);
      //this.peers.push(peer.nick);
      //$.event.allClients.push(peer.nick);
      //console.log('peers', this.allClients);
      $('#messages').append('<b>' +peer.nick+'</b>'+'&nbsp'+'ist wieder online');
      const remotes = document.getElementById('remotes');
      // show a file select form
      if (remotes) {
        var container = <any>document.createElement('div');

        container.className = 'kvc-video-container';
        container.setAttribute("style", "margin:10px ; height: 30%; width: 30%;border: 1px solid blue;");
        var spanuser=document.createElement('div');
        spanuser.className='username';
        spanuser.innerHTML=peer.nick;
        spanuser.setAttribute("style", "text-align: center;width: 100%;")

        //spanuser.appendChild(peer.nick);
        container.appendChild(spanuser);
        var uservideo = <any>document.createElement('div');
        uservideo.className = 'uservideo';
        container.id = 'container_' + self.webrtc.getDomId(peer);
        video.setAttribute("style", " height: 100%; width: 100%;")
        uservideo.appendChild(video);
        container.appendChild(uservideo);
        // show a list of files received / sending

        const chat__main = document.getElementById('chat__main');
        const chat__footer = document.getElementById('chat__footer');
        const messages = document.getElementById('messages');
        var filelist = document.createElement('p');
        filelist.className = 'fileList';
        messages.appendChild(filelist);
        // show a file select form
        
        // send a file
        
        //this.webrtc.getPeers().forEach(function(peer) { 


        fileinput.addEventListener('change', function() {
            fileinput.disabled = true;
            var file = fileinput.files[0];
            var sender = peer.sendFile(file);
             //$('#messages').append("<li class='sender' style='width:100%; float:left;'>"+"<i class='material-icons' style = 'color : blue;float:left;'>person</i>"+" <b>"+peer.nick + " </b> <br> ");
            // make a label
            // create a file item
            var item = document.createElement('div');
            item.className = 'sending';
           // $('.sending').append("<li style='width:100%; float:left;'>"+"<i class='material-icons' style = 'color : blue;float:left;'>person</i>"+" <b>"+peer.nick + " </b> <br> ");
            var span = document.createElement('span');
            span.className = 'filename';
            span.appendChild(document.createTextNode(file.name));
            item.appendChild(span);
            //span = document.createElement('span');
            //span.appendChild(document.createTextNode(file.size + ' bytes'));
            //item.appendChild(span);
            // create a progress element
            var sendProgress = document.createElement('progress');
            sendProgress.max = file.size;
            item.appendChild(sendProgress);
            // hook up send progress

            $('.sending').hide();


            sender.on('progress', function (bytesSent) {
                sendProgress.value = bytesSent;
            });
            // sending done
            sender.on('sentFile', function () {
                item.appendChild(document.createTextNode('sent'));
                // we allow only one filetransfer at a time
                fileinput.removeAttribute('disabled');
            });
            // receiver has actually received the file
            sender.on('complete', function () {
                // safe to disconnect now
            });
            //filelist.appendChild(item);
            //$('#messages').append("<li style='width:100%; float:left;'>"+"<i class='material-icons' style = 'color : blue;float:left;'>person</i>"+" <b style = 'color : black;float:left;'>"+this.userService.user.profile.firstName + " </b> <br> ");
            //const User="<li style='width:100%; float:left;'>"+"<i class='material-icons' style = 'color : blue;float:left;'>person</i>"+" <b style = 'color : black;float:left;'>"+User + " </b> <br> ";
            messages.appendChild(item);
            //$('.sending').show();
        }, false);
        fileinput.disabled = false;
        //container.appendChild(fileinput);
        //chat__main.appendChild(fileinput);



        

  


       
        if (peer && peer.pc) {
          const connstate = document.createElement('div');
          //connstate.innerText = self.nick;
          //container.appendChild(connstate);
          peer.pc.on('iceConnectionStateChange', function (event: any) {
            switch (peer.pc.iceConnectionState) {
              case 'checking':
                connstate.innerText = self.nick;
                break;
              case 'connected':
              case 'completed': // on caller side
                console.log(this.user);
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






         // receiving an incoming filetransfer
        peer.on('fileTransfer', function (metadata, receiver) {
            console.log('incoming filetransfer', metadata);
            var item = document.createElement('div');
            var htmlcode="<i class='material-icons' style = 'color : blue;float:left;'>person</i>"+" <b>"+peer.nick + " </b>"+" <br> ";
            item.className = 'receiving';
            //$('div').append(htmlcode);
            // make a label
            //var Datasender="<li style='width:100%; float:left;'>"+"<i class='material-icons' style = 'color : blue;float:left;'>person</i>"+" <b style = 'color : black;float:left;'>"+this.nick +  " </b> <br> ";
            var span = document.createElement('span');
            span.className = 'filename';
            //span.appendChild(document.createTextNode(Datasender));
            span.appendChild(document.createTextNode(metadata.name));
            item.appendChild(span);
            //span = document.createElement('span');
            //span.appendChild(document.createTextNode(metadata.size + ' bytes'));
            //item.appendChild(span);
            // create a progress element
            var receiveProgress = document.createElement('progress');
            receiveProgress.max = metadata.size;
            item.appendChild(receiveProgress);
            // hook up receive progress
            $('.receiving').show();
            receiver.on('progress', function (bytesReceived) {
                receiveProgress.value = bytesReceived;
            });
            // get notified when file is done
            receiver.on('receivedFile', function (file, metadata) {
                console.log('received file', metadata.name, metadata.size);
                var href = document.createElement('a');
                href.href = URL.createObjectURL(file);
                href.download = metadata.name;
                href.appendChild(document.createTextNode('download'));
                item.appendChild(href);
                // close the channel
                receiver.channel.close();
            });
            $('#messages').append("<li style='width:100%; float:left;'>"+"<i class='material-icons' style = 'color : blue;float:left;'>person</i>"+" <b style = 'color : black;float:left;'>"+peer.nick + " </b> <br> ");
            messages.appendChild(item);
            //filelist.appendChild(item);
        });
















      }

    
    });



        // a peer was removed
    self.webrtc.on('videoRemoved', function (video: any, peer: any) {
      console.log('video removed ', peer);
      var peerleave=peer.nick + ' hat das Zimmer verlassen';
      const addedpeer=peer.nick;
      //this.peers.splice(this.allClients.indexOf(addedpeer), 1);
      $('#messages').append('<h3 class="user" style="color:red">' +peerleave+'</h3>');
      const remotes = document.getElementById('remotes');
      const el = document.getElementById(peer ? 'container_' + self.webrtc.getDomId(peer) : 'localScreenContainer');
      if (remotes && el) {
        remotes.removeChild(el);
      }
    });


    // If our volume has changed, update the meter.




















    // local p2p/ice failure
    self.webrtc.on('iceFailed', function (peer: any) {
      const connstate: any = document.querySelector('#container_' + self.webrtc.getDomId(peer) + ' .connectionstate');
      console.log('local fail', connstate);
      if (connstate) {
        connstate.innerText = 'Connection failed.';
      }
    });
    // remote p2p/ice failure
    self.webrtc.on('connectivityError', function (peer: any) {
      const connstate: any = document.querySelector('#container_' + self.webrtc.getDomId(peer) + ' .connectionstate');
      console.log('remote fail', connstate);
      if (connstate) {
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

 

  toggleAudioMute ()
   {

      if (this.muteAudioClass === 'on')
      {
         this.muteAudioClass = 'off';
         this.webrtc.unmute ();
         this.mic='mic';
      }
      else
      {
         this.muteAudioClass = 'on';
         this.webrtc.mute ();
         this.mic='mic_off';
      }
   }


    toggleVideoMute ()
   {

      if (this.muteVideoClass === 'on')
      {
         this.muteVideoClass = 'off';
         this.webrtc.resumeVideo ();
         this.cam='videocam';
      }
      else
      {
         this.muteVideoClass = 'on';
         this.webrtc.pauseVideo ();
         this.cam='videocam_off';
      }
   }


   hangup ()
   {
    this.webrtc.stopLocalVideo();
    this.webrtc.leaveRoom();
    this.location.back();
    //this.router.navigate(['/overview']);
   }


   send(){
   if($('#text').val()!=''){
   var msg = $('#text').val();
   this.webrtc.sendToAll('chat', { message: msg, nick: this.nick ,date:this.myFormattedDate});
   //$('#messages').append('<br>'+this.nick+':'+'<br>' + msg + '\n');

    $('#messages').append("<li style='width:100%; float:left;'>"+"<i class='material-icons' style = 'color : blue;float:left;'>person</i>"+" <b style = 'color : black;float:left;'>"+this.nick +' &nbsp &nbsp'+this.myFormattedDate+ " </b> <br> "+"<span style = 'color :black; padding: 3px 10px;float:left;'>" + msg + '</span>');

                                                                                                             
    $('#chat__main').animate({
     scrollTop: $('#chat__main').get(0).scrollHeight}, 2000);  
    $('#text').val('');
}

}







}
