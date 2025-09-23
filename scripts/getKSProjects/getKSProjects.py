import re
import requests
import json
import os
import time
import random
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

def get_random_user_agent():
    """Get a random user agent from a pool of common browsers"""
    user_agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:119.0) Gecko/20100101 Firefox/119.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/120.0.0.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    ]
    return random.choice(user_agents)

# Global session and user agent tracking
current_session = None
requests_count = 0
max_requests_per_session = random.randint(8, 15)  # Random between 8-15 requests per session

def get_proxy_list():
    """Get list of proxies with authentication (add your own proxy service here)"""
    # Proxy configuration with username/password authentication
    # Format: http://username:password@proxy_host:port

    # Set your proxy credentials here
    PROXY_USERNAME = "yxxfirjz"  # Replace with your actual username
    PROXY_PASSWORD = "y97ny7u57jgq"  # Replace with your actual password

    # Example proxies with authentication - replace with your preferred proxy service
    return [
        {
            'http': f'http://{PROXY_USERNAME}:{PROXY_PASSWORD}@142.111.48.253:7030',
            'https': f'http://{PROXY_USERNAME}:{PROXY_PASSWORD}@142.111.48.253:7030'
        },
        {
            'http': f'http://{PROXY_USERNAME}:{PROXY_PASSWORD}@198.23.239.134:6540',
            'https': f'http://{PROXY_USERNAME}:{PROXY_PASSWORD}@198.23.239.134:6540'
        },
        # Add more proxies or integrate with proxy services like:
        # - ProxyMesh, Bright Data, ScrapingBee
        # - Free proxy APIs (less reliable)
    ]

def get_fresh_session():
    """Get a fresh session with rotating user agent and optional proxy"""
    global current_session, requests_count, max_requests_per_session

    if current_session is None or requests_count >= max_requests_per_session:
        if current_session:
            current_session.close()

        current_session = requests.Session()
        requests_count = 0
        max_requests_per_session = random.randint(8, 15)

        # Set random user agent for this session
        user_agent = get_random_user_agent()
        current_session.headers.update({'User-Agent': user_agent})

        # Enable cookie handling
        current_session.cookies.clear()
        current_session.cookies.update({'gdpr_banner_dismissed': '1', 'ksr_locale': 'en'})

        # Optionally set proxy (uncomment and configure)
        proxies = get_proxy_list()
        if proxies:
            proxy = random.choice(proxies)
            current_session.proxies.update(proxy)
            print(f"Using proxy: {proxy}")

        print(f"New session created (max {max_requests_per_session} requests)")

    requests_count += 1
    return current_session

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

    # Get fresh session with rotation
    session = get_fresh_session()

    try:
        print(f"Downloading: {url} (Session: {requests_count}/{max_requests_per_session})")

        # Comprehensive headers to mimic real browser (User-Agent already set in session)
        headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': random.choice(['en-US,en;q=0.9', 'en-GB,en;q=0.9', 'en-US,en;q=0.8,es;q=0.6']),
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
            'Referer': 'https://www.google.com/',
            'Origin': 'https://www.kickstarter.com',
            'DNT': '1',
            'Sec-GPC': '1'
        }

        # Add random delay to avoid rate limiting
        delay = random.uniform(8, 20)  # Increased delay between 8-20 seconds
        print(f"Waiting {delay:.1f}s...")
        time.sleep(delay)

        response = session.get(url, headers=headers, timeout=30)
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
            'content_length': len(response.text),
            'response_headers': dict(response.headers)
        }

        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(project_data, f, indent=2, ensure_ascii=False)

        print(f"Successfully downloaded: {clean_id}")

        return json_file
        
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 403:
            print(f"403 Forbidden for {url}: Bot detection likely triggered")
            print(f"  - Consider increasing delays or using different User-Agent")
        else:
            print(f"HTTP Error {e.response.status_code} for {url}: {e}")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Request error downloading {url}: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error for {url}: {e}")
        return None
    # Note: We don't close the session here anymore since it's managed globally

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

    # Clean up the global session
    if current_session:
        current_session.close()
        print("Session closed.")