async function submitPlaylistURL() {
  const playlistURL = document.getElementById('playlist-url').value.trim();
  if (!playlistURL) {
    document.getElementById('error-message').style.display = 'block';
    return;
  }

  try {
    const songs = await window.electronAPI.fetchSongs(playlistURL);
    document.getElementById('error-message').style.display = 'none';

    window.songList = songs;
    window.currentIndex = 0;
    window.selectedUrls = [];

    showScreen('song-selection-screen');
    loadNextSong();
  } catch (err) {
    console.error('Error fetching songs:', err);
    document.getElementById('error-message').style.display = 'block';
  }
}

async function loadNextSong() {
  const song = window.songList[window.currentIndex];
  if (!song) {
    startDownloadPhase();
    return;
  }

  const query = `${song.title} ${song.artist}`;
  const results = await window.electronAPI.searchYouTube(query);

  const container = document.getElementById('video-options');
  container.innerHTML = '';

  const titleDiv = document.getElementById('current-song-title');
  titleDiv.innerText = `${song.title} — ${song.artist}`;
  titleDiv.style.display = 'block'; // 👈 only show it now

  results.forEach((video) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'video-option';

    const img = document.createElement('img');
    img.src = video.thumbnail;
    img.alt = video.title;
    img.onclick = () => {
      window.selectedUrls.push(video.url);
      window.currentIndex += 1;
      loadNextSong();
    };

    // Create a div to show the video title
    const titleDiv = document.createElement('div');
    titleDiv.className = 'video-title';
    titleDiv.innerText = video.title;

    // Video channel below the title
    const channelDiv = document.createElement('div');
    channelDiv.className = 'video-channel';
    channelDiv.innerText = video.channel || 'Unknown Author';

    wrapper.appendChild(img);
    wrapper.appendChild(titleDiv);
    wrapper.appendChild(channelDiv);
    container.appendChild(wrapper);
  });
}

async function startDownloadPhase() {
  showScreen('progress-screen');
  const progress = document.getElementById('progress-count');
  const list = document.getElementById('song-status-list');
  list.innerHTML = '';
  progress.innerText = `0 of ${window.selectedUrls.length}`;

  let count = 0;
  for (const url of window.selectedUrls) {
    const li = document.createElement('li');
    li.innerText = `Downloading...`;
    list.appendChild(li);

    await window.electronAPI.downloadSongs([url]);

    li.innerHTML = `<span class="checkmark">✔</span> Downloaded`;
    count++;
    progress.innerText = `${count} of ${window.selectedUrls.length}`;
  }
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('playlist-url');
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      submitPlaylistURL();
    }
  });
});