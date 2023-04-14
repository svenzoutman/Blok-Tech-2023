const video = document.getElementById('video');
const play_pause = document.getElementById('play_pause');
const stop = document.getElementById('stop');

play_pause.addEventListener('click', PlayPauseVideo);
function PlayPauseVideo(){
    if(video.paused){
        play_pause.innterHTML="⏸︎";
        video.play();
    } else {
        play_pause.innerHTML="▶";
        video.pause();
    }
}

stop.addEventListener('click', stopVideo);
video.addEventListener('ended', stopVideo);
function stopVideo(){
    video.pause()
    video.currentTime = 0;
    play_pause.innerHTML = "▶";
}