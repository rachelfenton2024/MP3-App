from core.spotify_playlist_fetcher import get_playlist_tracks
from core.youtube_search import search_youtube_top_results_yt_dlp
from core.download_audio_from_url import download_audio_from_url

def main():
    # Get playlist URL from user
    playlist_url = input("Enter the Spotify playlist URL: ").strip()
    try:
        # Get track names from spotify and store in array
        tracks = get_playlist_tracks(playlist_url)

        # Print list of tracks
        print(f"Found {len(tracks)} tracks:\n")
        for i, track in enumerate(tracks, 1):
            print(f"{i}. {track['title']} — {track['artist']}")

        # Get top YouTube results for each track
        for track in tracks:
            print(f"\nSearching YouTube for: {track['title']} — {track['artist']}")
            query = f"{track['title']} — {track['artist']}"
            print(f"Searching YouTube for: {query}")

            top_results = search_youtube_top_results_yt_dlp(query)
            
            for idx, video in enumerate(top_results, 1):
                print(f"  {idx}. {video['title']} by {video['channel']}")
                print(f"     URL: {video['url']}")
                print(f"     Thumbnail: {video['thumbnail']}")
            print()

            while True:
                choice = input("Choose a video to download (1-3): ").strip()
                if choice in {'1', '2', '3'}:
                    selected_video = top_results[int(choice)-1]
                    print(f"Downloading '{selected_video['title']}'...")
                    download_audio_from_url(selected_video['url'])
                    print("Download complete!")
                    break
                else:
                    print("Invalid choice. Please enter 1, 2, or 3.")

    except ValueError as ve:
        print(ve)

if __name__ == "__main__":
    main()
