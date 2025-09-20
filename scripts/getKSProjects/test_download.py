import re
import requests
import json
import os
import time
from urllib.parse import urljoin
from datetime import datetime

def clean_project_id(project_id):
    """Clean project ID by removing query parameters"""
    if '?' in project_id:
        return project_id.split('?')[0]
    return project_id

def download_project_page(project_id, output_dir="downloaded_projects"):
    """Download a Kickstarter project page and save it locally"""
    
    # Clean the project ID
    clean_id = clean_project_id(project_id)
    
    # Skip invalid IDs
    if clean_id == 'feed.atom' or not clean_id.strip():
        return None
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Construct URL
    url = f"https://www.kickstarter.com/projects/{clean_id}"
    
    # Create safe filename
    safe_filename = re.sub(r'[<>:"/\\|?*]', '_', clean_id.replace('/', '_'))
    json_file = os.path.join(output_dir, f"{safe_filename}.json")
    html_file = os.path.join(output_dir, f"{safe_filename}.html")
    
    # Skip if already downloaded
    if os.path.exists(json_file):
        print(f"Already downloaded: {clean_id}")
        return json_file
    
    try:
        print(f"Downloading: {url}")
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        # Save HTML content
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(response.text)
        
        # Extract key information and save as JSON
        project_data = {
            'project_id': clean_id,
            'url': url,
            'download_timestamp': datetime.now().isoformat(),
            'html_content': response.text,
            'status_code': response.status_code,
            'content_length': len(response.text)
        }
        
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(project_data, f, indent=2, ensure_ascii=False)
        
        print(f"Successfully downloaded: {clean_id}")
        
        # Be respectful to the server
        time.sleep(2)
        
        return json_file
        
    except requests.exceptions.RequestException as e:
        print(f"Error downloading {url}: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error for {url}: {e}")
        return None

if __name__ == "__main__":
    # Test with a few successful projects
    test_projects = [
        "modulnails/modul-nails-modular-click-on-nails-you-can-swap-in-seconds",
        "glinet/comet-pro", 
        "snapmaker/snapmaker-u1-color-3d-printer-5x-more-speed-5x-less-waste"
    ]
    
    output_dir = "test_downloads"
    downloaded_files = []
    
    for i, project_id in enumerate(test_projects, 1):
        print(f"\n[{i}/{len(test_projects)}] Testing download: {project_id}")
        result = download_project_page(project_id, output_dir)
        if result:
            downloaded_files.append(result)
    
    print(f"\n=== TEST SUMMARY ===")
    print(f"Successfully downloaded: {len(downloaded_files)}")
    print(f"Files saved to: {output_dir}/")