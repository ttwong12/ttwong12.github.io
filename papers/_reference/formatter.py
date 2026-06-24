from pathlib import Path
import re


html_folder = Path(".")
output_folder = Path("doi_fixed")

output_folder.mkdir(exist_ok=True)


# Match DOI lines such as:
# <br>doi:10.1145/3805622.3810712.
# <br>DOI: 10.1109/TPAMI.2026.3664227
# doi:10.1007/978-3-032-04937-7_13.
DOI_RE = re.compile(
    r'(?is)(?:<br\s*/?>\s*)?doi\s*:\s*([^<]*?)(?=\s*<p\b|\s*$)'
)


def clean_doi_text(doi_text):
    """
    Clean DOI text:
    - remove surrounding whitespace
    - remove final punctuation such as . or ,
    - keep the actual DOI string
    """
    doi = doi_text.strip()

    while doi and doi[-1] in ".,;":
        doi = doi[:-1].strip()

    return doi


def ensure_text_before_doi_ends_with_fullstop(prefix):
    """
    Ensure the reference text immediately before the DOI line ends with a fullstop.
    """
    stripped = prefix.rstrip()
    trailing_space = prefix[len(stripped):]

    if not stripped:
        return prefix

    if stripped.endswith(","):
        stripped = stripped[:-1].rstrip() + "."
    elif not stripped.endswith("."):
        stripped = stripped + "."

    return stripped + trailing_space


def fix_doi_style(html):
    """
    Fix DOI style in one HTML snippet.

    Desired style:
        previous reference text.
        <br>DOI: 10.xxxx/xxxxx
        <p>
    """
    changed = False
    pos = 0
    out = html

    while True:
        match = DOI_RE.search(out, pos)

        if not match:
            break

        doi = clean_doi_text(match.group(1))

        if not doi:
            pos = match.end()
            continue

        prefix = out[:match.start()]
        suffix = out[match.end():]

        prefix_fixed = ensure_text_before_doi_ends_with_fullstop(prefix)
        replacement = f"<br>DOI: {doi}"

        new_out = prefix_fixed + replacement + suffix

        if new_out != out:
            changed = True

        out = new_out
        pos = len(prefix_fixed) + len(replacement)

    return out, changed


changed_count = 0
unchanged_count = 0

for html_file in html_folder.glob("*.html"):
    html = html_file.read_text(encoding="utf-8", errors="ignore")

    fixed_html, changed = fix_doi_style(html)

    if changed:
        output_path = output_folder / html_file.name
        output_path.write_text(fixed_html, encoding="utf-8")

        changed_count += 1
        print(f"Fixed DOI style: {html_file.name}")
    else:
        unchanged_count += 1
        print(f"No change: {html_file.name}")


print("Done.")
print(f"Changed files written: {changed_count}")
print(f"Unchanged files skipped: {unchanged_count}")
print(f"Output folder: {output_folder}")
