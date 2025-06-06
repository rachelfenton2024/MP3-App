import yt_dlp

def search_youtube_top_results_yt_dlp(query, num_results=3):
    ydl_opts = {
        'quiet': True,
        'extract_flat': True,  # Get metadata only, no download
    }

    search_query = f"ytsearch{num_results}:{query}"

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(search_query, download=False)
        results = info.get('entries', [])

    top_videos = []
    for video in results:
        video_id = video.get('id')
        video_url = f"https://www.youtube.com/watch?v={video_id}"
        thumbnail_url = f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"  # Construct thumbnail URL manually

        top_videos.append({
            'title': video.get('title'),
            'channel': video.get('uploader'),
            'url': video_url,
            'thumbnail': thumbnail_url,
        })

    return top_videos
