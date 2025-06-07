import sys
import json
from core.spotify_playlist_fetcher import get_playlist_tracks
from core.youtube_search import search_youtube_top_results
from core.download_audio_from_url import download_audio_from_url
import contextlib

#print("Python executable:", sys.executable)


def fetch_songs(playlist_url):
    songs = get_playlist_tracks(playlist_url)
    print(json.dumps(songs))

def search_youtube(query):
    results = search_youtube_top_results(query)  # returns list of 3 {url, title, thumbnail}
    print(json.dumps(results))


def download_songs(urls):
    for url in urls:
        download_audio_from_url(url)
    print(json.dumps({"status": "done"}))  


if __name__ == '__main__':
    action = sys.argv[1]
    if action == 'fetch_songs':
        fetch_songs(sys.argv[2])
    elif action == 'search_youtube':
        search_youtube(sys.argv[2])
    elif action == 'download_songs':
        download_songs(sys.argv[2:])
