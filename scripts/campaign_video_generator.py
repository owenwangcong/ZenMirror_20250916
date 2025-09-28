#!/usr/bin/env python3
"""
Campaign Video Generator - Creates videos for each scene and merges them into final campaign video
"""

import os
import json
import time
import base64
import subprocess
from pathlib import Path
from datetime import datetime
from google import genai
from google.genai import types
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("Environment variables loaded from .env file")
except ImportError:
    print("python-dotenv not installed, using system environment variables")
    pass

# Define the required scopes for Generative AI
SCOPES = ['https://www.googleapis.com/auth/cloud-platform']

# Output folder for generated videos
OUTPUT_FOLDER = Path('campaign_videos')

def ensure_output_folder():
    """Create output folder for campaign videos"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    session_folder = OUTPUT_FOLDER / f"campaign_{timestamp}"
    session_folder.mkdir(parents=True, exist_ok=True)

    # Create subfolders
    (session_folder / "scenes").mkdir(exist_ok=True)
    (session_folder / "final").mkdir(exist_ok=True)

    return session_folder

def authenticate():
    """Authenticate using OAuth2 credentials"""
    creds = None
    token_path = Path('token.json')

    if token_path.exists():
        creds = Credentials.from_authorized_user_file(str(token_path), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)

        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    return creds

def load_scene_data(json_path):
    """Load scene data from JSON file"""
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def generate_scene_video(client, scene, output_folder):
    """Generate a video for a single scene"""
    scene_id = scene['id']
    duration = scene.get('duration', 5)

    # Use the full, detailed prompt from campaign_scenes.json
    full_prompt = scene['prompt']

    # Add visual style and key elements for richer generation
    enhanced_prompt = f"{full_prompt} "

    if scene.get('visual_style'):
        enhanced_prompt += f"Visual style: {scene['visual_style']}. "

    if scene.get('key_elements'):
        enhanced_prompt += f"Include these elements: {', '.join(scene['key_elements'])}. "

    # Add audio/narration context if available
    if scene.get('narration'):
        enhanced_prompt += f"Context for the scene: {scene['narration']}"

    print(f"\n=== Generating Scene {scene_id}: {scene['title']} ===")
    print(f"Duration: {duration} seconds")
    print(f"Full prompt ({len(enhanced_prompt)} chars): {enhanced_prompt[:200]}...")

    try:
        # Create video generation operation with supported configuration
        operation = client.models.generate_videos(
            model='veo-3.0-fast-generate-001',
            prompt=enhanced_prompt,
            config=types.GenerateVideosConfig(
                number_of_videos=1,
                fps=24,
                duration_seconds=min(duration, 8),  # Allow up to 8 seconds for complex scenes
                enhance_prompt=True
                # Note: aspect_ratio and resolution parameters removed as they're not supported
            ),
        )

        print(f"Operation created: {operation.name}")
        print(f"Polling for scene {scene_id} completion...")

        # Poll the operation with longer timeout for complex prompts
        poll_count = 0
        max_polls = 45  # Allow up to 15 minutes for complex scenes

        while not operation.done and poll_count < max_polls:
            time.sleep(20)
            poll_count += 1
            print(f"  Poll #{poll_count}: Processing scene {scene_id}... (up to {max_polls} polls)")
            operation = client.operations.get(operation)

        if not operation.done:
            print(f"  ⏱️ Scene {scene_id} timed out after {poll_count * 20} seconds")
            return None

        # Check for errors
        if hasattr(operation, 'error') and operation.error:
            print(f"  ❌ Scene {scene_id} error: {operation.error}")
            return None

        # Save the generated video
        if operation.result and operation.result.generated_videos:
            for generated_video in operation.result.generated_videos:
                video = generated_video.video
                # Clean filename - remove invalid characters for Windows
                clean_title = scene['title'].replace(' ', '_').replace(':', '').replace('?', '')
                output_filename = output_folder / "scenes" / f"scene_{scene_id:02d}_{clean_title}.mp4"

                try:
                    if hasattr(video, 'video_bytes'):
                        video_bytes = video.video_bytes

                        if isinstance(video_bytes, bytes):
                            if video_bytes.startswith(b'AAAA') or video_bytes[:4] in [b'//8A', b'SUQA']:
                                video_data = base64.b64decode(video_bytes)
                            else:
                                video_data = video_bytes
                        elif isinstance(video_bytes, str):
                            video_data = base64.b64decode(video_bytes)
                        else:
                            video_data = video_bytes

                        with open(output_filename, 'wb') as f:
                            f.write(video_data)
                    elif hasattr(video, 'data'):
                        video_data = base64.b64decode(video.data)
                        with open(output_filename, 'wb') as f:
                            f.write(video_data)
                    elif hasattr(video, 'save'):
                        video.save(output_filename)
                        # Verify and fix if needed
                        with open(output_filename, 'rb') as f:
                            first_bytes = f.read(4)
                        if first_bytes in [b'AAAA', b'//8A', b'SUQA'] or not first_bytes.startswith(b'\x00\x00'):
                            with open(output_filename, 'r') as f:
                                b64_data = f.read()
                            decoded = base64.b64decode(b64_data)
                            with open(output_filename, 'wb') as f:
                                f.write(decoded)

                    print(f"✓ Scene {scene_id} video saved: {output_filename}")
                    return output_filename

                except Exception as e:
                    print(f"Error saving scene {scene_id} video: {e}")
                    return None
        else:
            print(f"✗ Scene {scene_id} generation failed")
            return None

    except Exception as e:
        print(f"Error generating scene {scene_id}: {e}")
        return None

def merge_videos_with_ffmpeg(video_files, output_path, transitions=True):
    """Merge multiple video files using ffmpeg"""
    print("\n=== Merging Videos with FFmpeg ===")

    # Create a temporary file list for ffmpeg concat
    list_file = output_path.parent / "filelist.txt"

    try:
        # Write file list for ffmpeg concat
        with open(list_file, 'w') as f:
            for video_file in video_files:
                # Use absolute paths and escape for ffmpeg
                abs_path = Path(video_file).absolute()
                f.write(f"file '{abs_path}'\n")

        # Build ffmpeg command
        cmd = [
            'ffmpeg',
            '-f', 'concat',
            '-safe', '0',
            '-i', str(list_file),
            '-c:v', 'libx264',  # Use H.264 codec
            '-preset', 'medium',  # Balance between speed and quality
            '-crf', '23',  # Quality level (lower = better, 23 is good)
            '-c:a', 'aac',  # Audio codec
            '-b:a', '192k',  # Audio bitrate
            '-movflags', '+faststart',  # Optimize for streaming
            '-y',  # Overwrite output
            str(output_path)
        ]

        if transitions:
            # Add fade transitions between clips (advanced)
            print("Note: For transitions, consider using a more advanced video editor")

        print(f"Running FFmpeg command...")
        result = subprocess.run(cmd, capture_output=True, text=True)

        if result.returncode == 0:
            print(f"✓ Videos merged successfully: {output_path}")
            # Clean up temp file
            list_file.unlink()
            return True
        else:
            print(f"✗ FFmpeg error: {result.stderr}")
            return False

    except FileNotFoundError:
        print("✗ FFmpeg not found. Please install FFmpeg to merge videos.")
        print("  Download from: https://ffmpeg.org/download.html")
        print("  Or install via: winget install ffmpeg (Windows)")
        return False
    except Exception as e:
        print(f"✗ Error merging videos: {e}")
        return False

def create_title_card(text, duration, output_path, client):
    """Generate a title card video"""
    prompt = f"Elegant title card with text '{text}' on a serene zen-inspired background with subtle particle effects, minimalist design, forest green and cream colors"

    try:
        operation = client.models.generate_videos(
            model='veo-3.0-fast-generate-001',
            prompt=prompt,
            config=types.GenerateVideosConfig(
                number_of_videos=1,
                fps=24,
                duration_seconds=duration,
                enhance_prompt=True
                # Note: aspect_ratio and resolution parameters removed as they're not supported
            ),
        )

        # Poll and save (similar to scene generation)
        # ... (polling code similar to above)

        return output_path
    except Exception as e:
        print(f"Error creating title card: {e}")
        return None

def main():
    """Main function to generate campaign video"""
    print("=" * 60)
    print("ZenMirror Campaign Video Generator")
    print("=" * 60)

    # Check for scene data
    scene_data_path = Path('campaign_scenes.json')
    if not scene_data_path.exists():
        print("Error: campaign_scenes.json not found!")
        return

    # Load scene data
    print("\nLoading scene data...")
    campaign_data = load_scene_data(scene_data_path)
    scenes = campaign_data['scenes']
    print(f"Found {len(scenes)} scenes to generate")

    # Authenticate
    print("\nAuthenticating with Google...")
    creds = authenticate()
    if not creds:
        print("Authentication failed!")
        return

    # Initialize client
    project_id = os.getenv('GCP_PROJECT_ID', 'gen-lang-client-0221426734')
    location = os.getenv('GCP_LOCATION', 'us-central1')

    print(f"\nInitializing GenAI client...")
    print(f"Project: {project_id}, Location: {location}")

    try:
        client = genai.Client(
            vertexai=True,
            project=project_id,
            location=location,
            credentials=creds
        )
        print("✓ Client initialized")
    except Exception as e:
        print(f"Failed to initialize client: {e}")

        # Try with API key
        api_key = os.getenv('GEMINI_API_KEY')
        if api_key:
            client = genai.Client(api_key=api_key)
            print("✓ Client initialized with API key")
        else:
            print("No API key found")
            return

    # Create output folder
    output_folder = ensure_output_folder()
    print(f"\nOutput folder: {output_folder}")

    # Generate videos for each scene
    generated_videos = []

    print("\n" + "=" * 60)
    print("STARTING SCENE GENERATION")
    print("=" * 60)

    # Generate all scenes with simplified prompts
    print(f"\n[FULL CAMPAIGN] Generating all {len(scenes)} scenes...")
    print("This will take approximately 10-15 minutes...\n")

    for scene in scenes:
        video_path = generate_scene_video(client, scene, output_folder)
        if video_path:
            generated_videos.append(video_path)
        else:
            print(f"Warning: Scene {scene['id']} failed")

        # Small delay between requests to avoid rate limiting
        if scene['id'] < len(scenes):
            print("Waiting 3 seconds before next scene...")
            time.sleep(3)

    # Report generation results
    print("\n" + "=" * 60)
    print(f"Generated {len(generated_videos)} / {len(scenes)} scene videos")
    print("=" * 60)

    if generated_videos:
        # Merge videos into final campaign video
        final_output = output_folder / "final" / "zenmirror_campaign_final.mp4"

        print("\nAttempting to merge videos...")
        if merge_videos_with_ffmpeg(generated_videos, final_output):
            print("\n" + "=" * 60)
            print("✓ CAMPAIGN VIDEO GENERATION COMPLETE!")
            print("=" * 60)
            print(f"\nFinal video: {final_output.absolute()}")
            print(f"Scene videos: {output_folder / 'scenes'}")

            # Report file sizes
            print("\nGenerated files:")
            for video_file in generated_videos:
                if Path(video_file).exists():
                    size_mb = Path(video_file).stat().st_size / (1024 * 1024)
                    print(f"  - {Path(video_file).name}: {size_mb:.2f} MB")

            if final_output.exists():
                size_mb = final_output.stat().st_size / (1024 * 1024)
                print(f"\nFinal video size: {size_mb:.2f} MB")
        else:
            print("\n✗ Video merging failed. Individual scene videos are available in:")
            print(f"  {output_folder / 'scenes'}")
    else:
        print("\n✗ No videos were generated successfully")

    print("\n" + "=" * 60)
    print("Process completed")
    print("=" * 60)

if __name__ == "__main__":
    main()