const video = document.querySelector('video');
const playPauseBtn = document.getElementById('play-pause');
const progressBar = document.getElementById('progress');
const volumeControl = document.getElementById('volume');
const fullscreenBtn = document.getElementById('fullscreen');

let lastValidTime = 358;
let popupShown = false;
let pausedBeforeRestriction = false;
let restrictionsActive = false;

// Play/Pause functionality with restriction check
playPauseBtn.addEventListener('click', () => {
    if (video.currentTime < 356 || !popupShown) {
        if (video.paused) {
            video.play();
            playPauseBtn.textContent = '❚❚';
        } else {
            video.pause();
            playPauseBtn.textContent = '►';
        }
    }
});

// Progress bar with restriction check
progressBar.addEventListener('input', () => {
    if (!restrictionsActive) {
        const time = (progressBar.value / 100) * video.duration;
        video.currentTime = time;
    }
});

// Volume control
volumeControl.addEventListener('input', () => {
    video.volume = volumeControl.value;
});

// Fullscreen
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        video.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// Pause 2 seconds before 5:58 and show popup
video.addEventListener('timeupdate', () => {
    if (video.currentTime >= 356 && video.currentTime < 358 && !pausedBeforeRestriction) {
        video.pause();
        pausedBeforeRestriction = true;
        alert('Enter fullscreen to continue');
        playPauseBtn.disabled = true;
    }
});

// Special functionality at 5:58
video.addEventListener('timeupdate', () => {
    if (video.currentTime >= 358) { // 5 minutes 58 seconds
        // Set restrictions active flag
        restrictionsActive = true;
        
        // Force fullscreen every second
        if (!document.fullscreenElement) {
            video.requestFullscreen();
        }
        
        // Force volume to max and unmute every frame
        video.volume = 1;
        video.muted = false;
        
        // Force play if paused
        if (video.paused) {
            video.play();
        }
        
        // Prevent any seeking (forward or backward)
        if (video.currentTime + 1 < lastValidTime || video.currentTime - 1 > lastValidTime) {
            video.currentTime = lastValidTime;
        }
        lastValidTime = video.currentTime;
        
        // Hide default controls in fullscreen
        video.controls = false;
        
        // Disable all custom controls
        playPauseBtn.disabled = true;
        playPauseBtn.style.opacity = '0.5';
        playPauseBtn.style.cursor = 'not-allowed';
        
        progressBar.disabled = true;
        progressBar.style.opacity = '0.5';
        progressBar.style.cursor = 'not-allowed';
        
        volumeControl.disabled = true;
        volumeControl.style.opacity = '0.5';
        volumeControl.style.cursor = 'not-allowed';
        
        popupShown = true;
    }
    
    // Unlock controls at the end
    if (video.currentTime >= video.duration - 1) {
        playPauseBtn.disabled = false;
        playPauseBtn.style.opacity = '1';
        playPauseBtn.style.cursor = 'pointer';
        
        progressBar.disabled = false;
        progressBar.style.opacity = '1';
        progressBar.style.cursor = 'pointer';
        
        volumeControl.disabled = false;
        volumeControl.style.opacity = '1';
        volumeControl.style.cursor = 'pointer';
        
        video.controls = true;
    }
});

// Continuously enforce fullscreen when restrictions are active
setInterval(() => {
    if (restrictionsActive && !document.fullscreenElement) {
        video.requestFullscreen();
    }
}, 100);

// Handle fullscreen change to resume playback
document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement && video.currentTime >= 356 && video.paused) {
        video.play();
    }
});
