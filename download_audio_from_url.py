import yt_dlp

def download_audio_from_url(video_url, output_path='./mp3s'):
    ydl_opts = {
        'format': 'bestaudio/best',
        'quiet': True,
        'no_warnings': True,
        'outtmpl': f'{output_path}/%(title)s.%(ext)s',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'logger': NoopLogger(),
        'progress_hooks': [lambda d: None],  # no hooks to stdout
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])

class NoopLogger:
    def debug(self, msg): pass
    def warning(self, msg): pass
    def error(self, msg): pass