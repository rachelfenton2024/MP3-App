from dotenv import load_dotenv
import os
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

# 👇 THIS LINE loads your .env variables into os.environ
load_dotenv()

# 👇 Now your keys will be picked up here
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials())

# Make sure you have SPOTIPY_CLIENT_ID and SPOTIPY_CLIENT_SECRET set in your environment
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials())

def get_playlist_tracks(playlist_id):
    """Returns a list of dictionaries with 'title' and 'artist' for each track."""
    results = sp.playlist_items(playlist_id, additional_types=['track'])
    tracks = results['items']

    # If the playlist is long, paginate through it
    while results['next']:
        results = sp.next(results)
        tracks.extend(results['items'])

    song_list = []

    for item in tracks:
        track = item['track']
        if track is None:
            continue

        title = track['name']
        artists = [artist['name'] for artist in track['artists']]
        artist_name = ', '.join(artists)  # e.g., for collabs

        song_list.append({
            'title': title,
            'artist': artist_name
        })

    return song_list
