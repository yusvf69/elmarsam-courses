import { NextRequest, NextResponse } from "next/server";
import ytdl from "ytdl-core";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("id");

    if (!videoId) {
      return new NextResponse("Video ID is required", { status: 400 });
    }

    // Validate video ID format
    if (!ytdl.validateID(videoId)) {
      return new NextResponse("Invalid video ID", { status: 400 });
    }

    const url = `https://www.youtube.com/watch?v=${videoId}`;

    // Get video info to check if it's available
    let videoInfo;
    try {
      videoInfo = await ytdl.getInfo(url);
    } catch (error) {
      console.error("Error getting video info:", error);
      return new NextResponse("Video not available or private", { status: 404 });
    }

    // Get the best format with both audio and video
    const format = ytdl.chooseFormat(videoInfo.formats, { 
      quality: "highest",
      filter: "audioandvideo"
    });

    if (!format) {
      return new NextResponse("No suitable format found", { status: 404 });
    }

    // Fetch the video stream
    const videoResponse = await fetch(format.url);
    
    if (!videoResponse.ok) {
      return new NextResponse("Failed to fetch video", { status: 500 });
    }

    // Get the video buffer
    const videoBuffer = await videoResponse.arrayBuffer();

    // Return the video as a local stream
    return new NextResponse(videoBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": videoBuffer.byteLength.toString(),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600",
        "Content-Disposition": "inline",
      },
    });

  } catch (error) {
    console.error("Stream error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
