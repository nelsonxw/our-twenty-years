import os
import re
import urllib.parse
import urllib3
from google.cloud import storage

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

KEY_FILE = 'service-account.json'
BUCKET_NAME = 'our-twenty-years.firebasestorage.app'
PUBLIC_DIR = 'public'
DIRECTORIES = ['images', 'videos']
YEARS_FILE = 'src/data/years.json'

def collect_files():
    files = []
    for d in DIRECTORIES:
        root = os.path.join(PUBLIC_DIR, d)
        if not os.path.isdir(root):
            continue
        for dirpath, _, filenames in os.walk(root):
            for name in filenames:
                files.append(os.path.join(dirpath, name))
    return files

def main():
    client = storage.Client.from_service_account_json(KEY_FILE)
    client._http.verify = False
    bucket = client.bucket(BUCKET_NAME)

    files = collect_files()
    print(f'Found {len(files)} files to upload')

    mapping = {}
    for idx, local_path in enumerate(files, start=1):
        dest = os.path.relpath(local_path, PUBLIC_DIR).replace(os.sep, '/')
        blob = bucket.blob(dest)
        blob.upload_from_filename(local_path)
        blob.make_public()
        public_url = f'https://storage.googleapis.com/{BUCKET_NAME}/{urllib.parse.quote(dest, safe="/")}'
        mapping['/' + dest] = public_url
        if idx % 10 == 0 or idx == len(files):
            print(f'Uploaded {idx}/{len(files)}: {dest}')

    print('All uploads complete. Updating years.json...')
    with open(YEARS_FILE, 'r', encoding='utf-8') as f:
        text = f.read()

    def replace_url(match):
        local = match.group(1)
        return f'"{mapping.get(local, local)}"'

    updated = re.sub(r'"(/(?:images|videos)/[^"]*)"', replace_url, text)
    with open(YEARS_FILE, 'w', encoding='utf-8') as f:
        f.write(updated)

    print('years.json updated.')

if __name__ == '__main__':
    main()
