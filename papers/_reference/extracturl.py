from pathlib import Path
import csv
from urllib.parse import urljoin
from bs4 import BeautifulSoup


html_folder = Path(".")
output_csv = Path("paper_urls.csv")

base_url = "https://ttwong12.github.io"

records = []

for html_file in html_folder.glob("*.html"):
    with open(html_file, "r", encoding="utf-8", errors="ignore") as f:
        html = f.read()

    soup = BeautifulSoup(html, "html.parser")

    link = soup.find("a", href=True)

    if link:
        url = link["href"].strip()

        # Convert local path to full internet URL
        url = urljoin(base_url, url)

        title = link.get_text(strip=True).replace('\n', ' ')

        records.append({
            "title": title,
            "url": url,
            "source_file": html_file.name
        })


with open(output_csv, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["title", "url", "source_file"])
    writer.writeheader()
    writer.writerows(records)

print(f"Extracted {len(records)} records to {output_csv}")