"use client"

import type { YoutubeVideo } from "./types"

const YOUTUBE_API_KEY = "AIzaSyDV_W02SDk5EPjSHKZHtE--X4nbKDWluSQ"

export async function fetchYoutubeVideos(query: string): Promise<YoutubeVideo[]> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${encodeURIComponent(
        query + " recipe",
      )}&type=video&key=${YOUTUBE_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("YouTube API request failed")
    }

    const data = await response.json()

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      duration: "4:32", // Duration would require another API call in a real implementation
    }))
  } catch (error) {
    console.error("Error fetching YouTube videos:", error)
    return []
  }
}
