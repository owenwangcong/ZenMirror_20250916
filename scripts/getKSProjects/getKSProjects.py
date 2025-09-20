import re
import requests
import json
import os
import time
from urllib.parse import urljoin
from datetime import datetime

def find_kickstarter_projects(file_path):
    """Find all Kickstarter project URLs matching the pattern href="https://www.kickstarter.com/projects/(.*?)" """
    
    # Read the input file
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Define the regex pattern
    pattern = r'href="https://www\.kickstarter\.com/projects/(.*?)"'
    
    # Find all matches
    matches = re.findall(pattern, content)
    
    return matches

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
    # Input file path
    input_file = "KS.html"
    
    # Find all matches
    project_ids = find_kickstarter_projects(input_file)
    
    # Clean and deduplicate project IDs
    clean_ids = [clean_project_id(pid) for pid in project_ids]
    unique_ids = list(set([pid for pid in clean_ids if pid != 'feed.atom' and pid.strip()]))
    
    print(f"Found {len(project_ids)} Kickstarter project URLs ({len(unique_ids)} unique):")
    
    # Download all unique project pages
    output_dir = "downloaded_projects"
    downloaded_files = []
    
    for i, project_id in enumerate(unique_ids, 1):
        print(f"\n[{i}/{len(unique_ids)}] Processing: {project_id}")
        result = download_project_page(project_id, output_dir)
        if result:
            downloaded_files.append(result)
    
    print(f"\n=== DOWNLOAD SUMMARY ===")
    print(f"Total unique projects: {len(unique_ids)}")
    print(f"Successfully downloaded: {len(downloaded_files)}")
    print(f"Failed downloads: {len(unique_ids) - len(downloaded_files)}")
    print(f"Files saved to: {output_dir}/")
    
    # Save download log
    log_data = {
        'timestamp': datetime.now().isoformat(),
        'total_found': len(project_ids),
        'unique_projects': len(unique_ids),
        'successfully_downloaded': len(downloaded_files),
        'failed_downloads': len(unique_ids) - len(downloaded_files),
        'downloaded_files': downloaded_files
    }
    
    with open(os.path.join(output_dir, 'download_log.json'), 'w', encoding='utf-8') as f:
        json.dump(log_data, f, indent=2, ensure_ascii=False)
    
    print(f"Download log saved to: {output_dir}/download_log.json")