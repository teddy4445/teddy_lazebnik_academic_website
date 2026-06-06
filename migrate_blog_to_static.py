#!/usr/bin/env python3
"""One-time migration script for converting the blog to static HTML.

This script:
1. Builds a fully rendered ``blog.html`` page from ``data/jsons/blog.json``.
2. Converts each ``blog/blog-post-<id>.html`` fragment into a full static page.
3. Rewrites old ``blog-post.html?post=<id>`` links across the repository.
4. Regenerates ``sitemap.xml`` with the blog post URLs.
5. Removes blog-specific JSON/JS files that are no longer needed.

Important:
- This is designed as a migration script, not a repeatable build pipeline.
- After cleanup, the original JSON-driven inputs are removed from their current
  locations, so rerunning the script requires restoring them from version
  control first.
"""

from __future__ import annotations

import html
import json
import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parent
SITE_URL = "https://teddylazebnik.com"
BLOG_PATH = ROOT / "blog"
BLOG_INDEX_PATH = ROOT / "blog.html"
SITEMAP_PATH = ROOT / "sitemap.xml"

HEADER_PATH = ROOT / "components" / "header.html"
FOOTER_PATH = ROOT / "components" / "footer.html"
BLOG_JSON_PATH = ROOT / "data" / "jsons" / "blog.json"
NEXT_BLOG_JSON_PATH = ROOT / "data" / "jsons" / "next_blog.json"

OBSOLETE_FILES = (
    ROOT / "blog-post.html",
    ROOT / "data" / "jsons" / "blog.json",
    ROOT / "data" / "jsons" / "next_blog.json",
    ROOT / "js" / "pages" / "blog.js",
    ROOT / "js" / "pages" / "blog-post.js",
    ROOT / "js" / "components" / "blogCard.js",
    ROOT / "js" / "components" / "nextBlogPostCard.js",
)

TEXT_EXTENSIONS_TO_REWRITE = {
    ".html",
    ".json",
    ".xml",
    ".txt",
    ".md",
    ".js",
    ".css",
}


@dataclass(frozen=True)
class BlogPost:
    post_id: str
    title: str
    description: str
    year: int
    month: int
    day: int
    order: int
    date_label: str
    title_html: str
    content_html: str
    reading_time: int

    @property
    def output_path(self) -> Path:
        return BLOG_PATH / f"blog-post-{self.post_id}.html"

    @property
    def url_path(self) -> str:
        return f"/blog/blog-post-{self.post_id}.html"

    @property
    def canonical_url(self) -> str:
        return f"{SITE_URL}{self.url_path}"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8", newline="\n")


def escape_json_ld(value: object) -> str:
    return json.dumps(value, ensure_ascii=False, indent=2)


def minified_html_block(content: str) -> str:
    return content.strip() + "\n"


def strip_tags(value: str) -> str:
    value = re.sub(r"<br\s*/?>", " ", value, flags=re.IGNORECASE)
    value = re.sub(r"</p>", " ", value, flags=re.IGNORECASE)
    value = re.sub(r"<[^>]+>", "", value)
    return html.unescape(re.sub(r"\s+", " ", value)).strip()


def compute_reading_time(content_html: str) -> int:
    words = strip_tags(content_html).split()
    return max(1, round(len(words) / 240))


def parse_post_fragment(fragment_text: str) -> tuple[str, str, str]:
    parts = fragment_text.split('<hr class="publications-hr">', 2)
    if len(parts) != 3:
        raise ValueError("Blog fragment is not in the expected title/date/content format.")
    title_html, date_html, content_html = (part.strip() for part in parts)
    return title_html, date_html, content_html


def extract_title_text(title_html: str) -> str:
    title_text = strip_tags(title_html)
    if not title_text:
        raise ValueError("Could not extract a title from blog fragment.")
    return title_text


def rewrite_blog_links(text: str) -> str:
    patterns = [
        r"https?://teddylazebnik\.(?:com|info)/blog-post\.html\?post=(\d+)",
        r"/blog-post\.html\?post=(\d+)",
        r"blog-post\.html\?post=(\d+)",
    ]

    rewritten = text
    for pattern in patterns:
        rewritten = re.sub(
            pattern,
            lambda match: f"/blog/blog-post-{match.group(1)}.html",
            rewritten,
        )
    return rewritten


def sanitize_post_content(content_html: str) -> str:
    sanitized = rewrite_blog_links(content_html)
    sanitized = re.sub(r'\sdata-src="/blog/blog-post-\d+\.html"', "", sanitized)
    sanitized = re.sub(r"\sdata-download-link", "", sanitized)
    return sanitized


def build_shared_inline_script() -> str:
    return """<script>
function gotoIndex() {
  var width = Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
  if (width > 850) {
    window.location.replace("/");
  }
}

(function () {
  var background = document.getElementById("mobile-menu-bg");
  var menu = document.getElementById("mobile-menu");

  if (background && menu) {
    background.onclick = function () {
      menu.style.marginLeft = "-320px";
      background.style.marginLeft = "100%";
    };

    menu.onclick = function (event) {
      event.stopPropagation();
    };
  }
})();
</script>"""


def build_base_head(
    *,
    title: str,
    description: str,
    canonical_url: str,
    extra_css: Iterable[str] = (),
    extra_meta: str = "",
    extra_head: str = "",
) -> str:
    css_paths = [
        '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">',
        '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" crossorigin="anonymous" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"/>',
        '<link href="/css/main.css" rel="stylesheet">',
    ]
    css_links = css_paths + [f'<link href="{path}" rel="stylesheet">' for path in extra_css]
    css_html = "\n\t".join(css_links)

    return f"""<head>
\t<meta charset="utf-8"/>
\t<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
\t<title>{html.escape(title)}</title>
\t<meta content="{html.escape(description, quote=True)}" name="description"/>
\t<meta name="keywords" content="lazebnik, teddy lazebnik, applied computational mathematics, academic blog"/>
\t<meta content="Teddy Lazebnik" name="author"/>
\t<link href="/img/favicon.ico" rel="icon" type="image/x-icon"/>
\t<link rel="canonical" href="{html.escape(canonical_url, quote=True)}"/>
\t<meta property="og:type" content="article"/>
\t<meta property="og:site_name" content="Teddy Lazebnik"/>
\t<meta property="og:title" content="{html.escape(title, quote=True)}"/>
\t<meta property="og:description" content="{html.escape(description, quote=True)}"/>
\t<meta property="og:url" content="{html.escape(canonical_url, quote=True)}"/>
\t<meta name="twitter:card" content="summary"/>
\t{extra_meta}
\t{css_html}
\t{extra_head}
</head>"""


def build_page_document(
    *,
    title: str,
    description: str,
    canonical_url: str,
    body_class: str = "",
    extra_css: Iterable[str] = (),
    extra_meta: str = "",
    extra_head: str = "",
    main_html: str,
    script_sources: Iterable[str] = (),
    extra_scripts: Iterable[str] = (),
) -> str:
    header_html = minified_html_block(read_text(HEADER_PATH))
    footer_html = minified_html_block(read_text(FOOTER_PATH))

    body_class_attr = f' class="{body_class}"' if body_class else ""
    script_tags = [f'<script src="{src}"></script>' for src in script_sources]
    script_tags.append(build_shared_inline_script())
    script_tags.extend(extra_scripts)
    scripts_html = "\n\t".join(script_tags)

    return f"""<!DOCTYPE html>
<html lang="en">
{build_base_head(
    title=title,
    description=description,
    canonical_url=canonical_url,
    extra_css=extra_css,
    extra_meta=extra_meta,
    extra_head=extra_head,
)}
<body{body_class_attr}>
\t<header class="header" id="header">
\t\t{header_html.rstrip()}
\t</header>
\t<main class="content" id="main_section">
\t\t{main_html.rstrip()}
\t</main>
\t<footer class="footer" id="footer">
\t\t{footer_html.rstrip()}
\t</footer>
\t{scripts_html}
</body>
</html>
"""


def build_blog_card(post: BlogPost) -> str:
    return f"""<div class="academic-papers-panel">
\t<h3 class="blog-title">{html.escape(post.title)}</h3>
\t<p>{html.escape(post.description)}</p>
\t<div class="personal-row space-between align-items-center mobile-row-breaker">
\t\t<div class="w-100">
\t\t\t<span class="blog-data">{post.day}/{post.month}/{post.year}</span>
\t\t</div>
\t\t<div class="w-100 flex-end align-items-center mobile-row-spacer">
\t\t\t<a href="{post.url_path}" class="download-btn">Read More</a>
\t\t</div>
\t</div>
</div>"""


def build_next_card(next_post: dict[str, str]) -> str:
    description = next_post["description"]
    if len(description) > 150:
        description = description[:150].rstrip() + "..."

    title = html.escape(next_post["title"])
    date_label = html.escape(next_post["date"])
    description = html.escape(description)
    link = f"/blog/blog-post-{next_post['link_address']}.html"
    reading_time = html.escape(next_post["reading_time"])

    return f"""<div class="academic-papers-panel next-blog-card-size">
\t<div class="personal-col w-100 next-post-box-title">
\t\t<h3>{title}</h3>
\t\t<div class="meta-blog-next-post-time-element meta-blog-post-title">{date_label} &#9679; {reading_time} minutes to read </div>
\t\t<h5>{description}</h5>
\t\t<div class="w-100 flex-end align-items-center mobile-row-spacer">
\t\t\t<a href="{link}" class="download-btn">Read More</a>
\t\t</div>
\t</div>
</div>"""


def build_blog_index(posts: list[BlogPost]) -> str:
    cards_html = "\n\t\t\t\t".join(build_blog_card(post) for post in posts)
    main_html = f"""<div class="academic-papers-container">
\t\t\t<div class="academic-papers-header-section">
\t\t\t\t<h1>Blog</h1>
\t\t\t\t<p>Published non-acadmic papers, presentations, and blog posts.</p>
\t\t\t</div>
\t\t\t<hr class="publications-hr">
\t\t\t<div class="academic-papers-body-section" id="publications-body">
\t\t\t\t{cards_html}
\t\t\t</div>
\t\t</div>"""

    json_ld = escape_json_ld(
        {
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Teddy Lazebnik Blog",
            "url": f"{SITE_URL}/blog.html",
            "description": "Published non-academic papers, presentations, and blog posts by Teddy Lazebnik.",
        }
    )

    return build_page_document(
        title="Blog | Teddy Lazebnik",
        description="Published non-academic papers, presentations, and blog posts by Teddy Lazebnik.",
        canonical_url=f"{SITE_URL}/blog.html",
        extra_css=('/css/descriptionTrim.css',),
        extra_head=f'<script type="application/ld+json">\n{json_ld}\n\t</script>',
        main_html=main_html,
        script_sources=('/js/search.js',),
    )


def build_blog_post_page(post: BlogPost, next_posts: list[dict[str, str]]) -> str:
    next_section = ""
    if next_posts:
        next_cards = "\n\t\t\t\t".join(build_next_card(next_post) for next_post in next_posts)
        next_section = f"""
\t\t<div class="blog-post-next-blogs-background" id="next_read_all">
\t\t\t<div class="blog-post-title-container">
\t\t\t\t<div class="blog-post-next-blogs-section">
\t\t\t\t\t<div id="next_blogs_title" class="continue_reading">
\t\t\t\t\t\t<h3>Continue Reading</h3>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t<div class="blog-post-next-blogs-section next-blog-card-wrapper" id="next_papers">
\t\t\t\t\t{next_cards}
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>"""

    json_ld = escape_json_ld(
        {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.description,
            "datePublished": date(post.year, post.month, post.day).isoformat(),
            "author": {
                "@type": "Person",
                "name": "Teddy Lazebnik",
            },
            "mainEntityOfPage": post.canonical_url,
            "url": post.canonical_url,
        }
    )

    main_html = f"""<div class="blog-post-title-background">
\t\t\t<div class="blog-post-title-container">
\t\t\t\t<div class="blog-post-title-section">
\t\t\t\t\t<div id="title" class="blog-post-title">
\t\t\t\t\t\t{post.title_html}
\t\t\t\t\t\t<div class="meta-blog-post-title">{html.escape(post.date_label)} &#9679; {post.reading_time} minutes to read </div>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t\t<div class="academic-papers-container" style="margin-top: 0px;">
\t\t\t<div class="academic-papers-header-section">
\t\t\t\t<div id="content" class="blog-post">
\t\t\t\t\t{post.content_html}
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>{next_section}"""

    return build_page_document(
        title=f"{post.title} | Teddy Lazebnik",
        description=post.description,
        canonical_url=post.canonical_url,
        body_class="line-numbers",
        extra_css=('/css/descriptionTrim.css', '/css/prism.css'),
        extra_head="""<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
\t<script>
\tMathJax = {
\t  tex: {
\t\tinlineMath: [['$', '$'], ['\\\\(', '\\\\)']]
\t  }
\t};
\t</script>
\t<script async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>
\t<script type="application/ld+json">
"""
        + json_ld
        + """
\t</script>""",
        main_html=main_html,
        script_sources=('/js/search.js', '/js/prism.js'),
    )


def load_posts() -> list[BlogPost]:
    blog_data = json.loads(read_text(BLOG_JSON_PATH))
    posts_by_id: dict[str, BlogPost] = {}

    for entry in blog_data["posts"]:
        post_id = str(entry["fileLinks"][0]["link"])
        fragment_path = BLOG_PATH / f"blog-post-{post_id}.html"
        if not fragment_path.exists():
            raise FileNotFoundError(f"Missing blog fragment: {fragment_path}")

        title_html, date_html, content_html = parse_post_fragment(read_text(fragment_path))
        content_html = sanitize_post_content(content_html)
        title_html = rewrite_blog_links(title_html)
        date_html = strip_tags(date_html)
        title_text = extract_title_text(title_html)
        reading_time = compute_reading_time(content_html)

        posts_by_id[post_id] = BlogPost(
            post_id=post_id,
            title=title_text,
            description=entry["description"],
            year=int(entry["year"]),
            month=int(entry["month"]),
            day=int(entry["day"]),
            order=int(entry["order"]),
            date_label=date_html,
            title_html=title_html,
            content_html=content_html,
            reading_time=reading_time,
        )

    return list(posts_by_id.values())


def load_next_posts() -> dict[str, list[dict[str, str]]]:
    next_posts_data = json.loads(read_text(NEXT_BLOG_JSON_PATH))
    for post_id, entries in next_posts_data.items():
        for entry in entries:
            entry["description"] = rewrite_blog_links(entry["description"])
    return next_posts_data


def write_blog_pages(posts: list[BlogPost], next_posts: dict[str, list[dict[str, str]]]) -> None:
    sorted_posts = sorted(posts, key=lambda post: post.order, reverse=True)
    write_text(BLOG_INDEX_PATH, build_blog_index(sorted_posts))

    for post in posts:
        page_html = build_blog_post_page(post, next_posts.get(post.post_id, []))
        write_text(post.output_path, page_html)


def rewrite_links_in_repo() -> None:
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        if path in OBSOLETE_FILES:
            continue
        if path.suffix.lower() not in TEXT_EXTENSIONS_TO_REWRITE:
            continue

        original = read_text(path)
        rewritten = rewrite_blog_links(original)
        if rewritten != original:
            write_text(path, rewritten)


def build_sitemap(posts: list[BlogPost]) -> str:
    blog_urls = sorted(posts, key=lambda post: post.order, reverse=True)

    entries = [
        (
            "/",
            "1.00",
        ),
        (
            "/publications.html",
            "0.80",
        ),
        (
            "/research.html",
            "0.80",
        ),
        (
            "/about.html",
            "0.80",
        ),
        (
            "/teaching.html",
            "0.80",
        ),
        (
            "/blog.html",
            "0.80",
        ),
        (
            "https://acml.teddylazebnik.com/index.html",
            "1.00",
        ),
    ]

    url_blocks = []
    today = date.today().isoformat()

    for location, priority in entries:
        full_location = location if location.startswith("http") else f"{SITE_URL}{location}"
        url_blocks.append(
            f"""<url>
  <loc>{html.escape(full_location)}</loc>
  <lastmod>{today}</lastmod>
  <priority>{priority}</priority>
</url>"""
        )

    for post in blog_urls:
        url_blocks.append(
            f"""<url>
  <loc>{html.escape(post.canonical_url)}</loc>
  <lastmod>{date(post.year, post.month, post.day).isoformat()}</lastmod>
  <priority>0.70</priority>
</url>"""
        )

    return """<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
{blocks}
</urlset>
""".format(blocks="\n".join(url_blocks))


def cleanup_obsolete_files() -> None:
    for path in OBSOLETE_FILES:
        if path.exists():
            path.unlink()


def main() -> None:
    missing_sources = [path for path in (BLOG_JSON_PATH, NEXT_BLOG_JSON_PATH, HEADER_PATH, FOOTER_PATH) if not path.exists()]
    if missing_sources:
        missing_text = "\n".join(f"- {path}" for path in missing_sources)
        raise SystemExit(
            "Cannot run the migration because required source files are missing.\n"
            "Restore them from version control and run again:\n"
            f"{missing_text}"
        )

    posts = load_posts()
    next_posts = load_next_posts()

    write_blog_pages(posts, next_posts)
    rewrite_links_in_repo()
    write_text(SITEMAP_PATH, build_sitemap(posts))
    cleanup_obsolete_files()

    print(f"Generated static blog index: {BLOG_INDEX_PATH}")
    print(f"Generated static blog post pages: {len(posts)}")
    print("Rewrote legacy blog links across text files in the repository.")
    print("Removed obsolete blog runtime files.")


if __name__ == "__main__":
    main()
