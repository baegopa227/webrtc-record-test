// 영상 저장
var mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);

var mediaRecorder;
var recordedBlobs;
var sourceBuffer;

var gumVideo = document.querySelector('video#gum');

var recordButton = document.querySelector('button#record');
var downloadButton = document.querySelector('button#download');

recordButton.onclick = toggleRecording;
downloadButton.onclick = download;

var constraints = {
    audio: true,
    video: true
};

function handleSuccess(stream){
    recordButton.disabled = false;
    console.log('getuserMedia() got stream: ', stream);
    window.stream = stream;
    if(window.URL){
        gumVideo.src = window.URL.createObjectURL(stream);
        
    }else{
        gumVideo.src = stream;
    }
}

function handleError(error){
    console.log('navigator.getUserMedia error:',error);
    
}

navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);


function handleSourceOpen(event){
    console.log('MediaSource opened');
    sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
    console.log('Source buffer: ', sourceBuffer);
}

function toggleRecording(){
    if(recordButton.textContent === 'Start Recording'){
        startRecording();
        
    }else{
        stopRecording();
        recordButton.textContent = 'Start Recording';
        downloadButton.disabled = false;
    }
    
}

function startRecording(){
    recordedBlobs = [];
    var options = {mimeType: 'video/mp4;codecs=vp9'};
    if(!MediaRecorder.isTypeSupported(options.mimeType)){
        console.log(options.mimeType + ' is not supported');
        options = {mimeType: 'video/mp4;codecs=vp8'};
    if(!MediaRecorder.isTypeSupported(options.mimeType)){
        console.log(options.mimeType + ' is not supported');
        options = {mimeType: 'video/mp4'};
    if(!MediaRecorder.isTypeSupported(options.mimeType)){
        console.log(options.mimeType + ' is not supported');
        options = {mimeType:''};
    }    
    }
    }
    try{
        //console.log(window.stream1);
        mediaRecorder = new MediaRecorder(window.stream, options);
        
    }catch(e){
        console.log('Exception while creating MediaRecorder: ' + e);
        alert('Exception while creating MediaRecorder:' + e + '.mimeType: ' + options.mimeType);
        return;
    }
    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
    recordButton.textContent = 'Stop Recording';
    downloadButton.disabled = true;
    mediaRecorder.onstop = handleStop;
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(10); // collect 10ms of data
    console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording(){
    mediaRecorder.stop();
    console.log('Recorded Blobs: ', recordedBlobs);
}

function handleStop(event){
    console.log('Recorder stopped: ', event);
}

function handleDataAvailable(event){
    if(event.data && event.data.size > 0){
        recordedBlobs.push(event.data);
    }
}

function download(){
    var blob = new Blob(recordedBlobs, {type: 'video/mp4'});
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.mp4';
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){
       document.body.appendChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}