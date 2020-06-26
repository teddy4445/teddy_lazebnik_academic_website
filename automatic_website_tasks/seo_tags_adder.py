# library imports
import os
import glob
import argparse
from bs4 import BeautifulSoup

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Parameters for run')
    parser.add_argument('--folder', type=str, help='The folder with the html files of the website')
    parser.add_argument('--qa', type=bool, help='print qa messages')
    args = parser.parse_args()

    # default parameters' values
    folder = args.folder if args.folder is not None else os.path.join("..", os.path.dirname(__file__))
    qa = args.qa if args.qa is not None else True

    # run over all the files from the needed file type in the needed folder
    for filepath in glob.iglob(os.path.join(folder, "**", "*.html"), recursive=True):
        print("Start {}".format(filepath))
        data = ""
        # read file
        with open(filepath, "r", encoding="utf-8") as data_file:
            html = data_file.read()
        # create HTML dom
        soup = BeautifulSoup(html, 'html.parser')
        # first, add titles to links by inner text
        a_links = soup.find_all('a')
        for a_link in a_links:
            if a_link.get("title") is None:
                # need to add title - if text, add it. if image, add it's name
                if a_link.getText() != "":
                    a_link["title"] = a_link.getText().strip()
                elif a_link.contents[0].name == "img":
                    a_link["title"] = a_link.contents[0]["src"].split("/")[-1].split(".")[0].strip()
                else:
                    a_link["title"] = a_link["href"]
                print("[QA] add title to link '{}'".format(a_link["href"]))
        # second, add to all image a 'alt' atribute
        imgs = soup.find_all('img')
        for img in imgs:
            if img.get("alt") is None:
                img["alt"] = img["src"].split("/")[-1].split(".")[0].strip()
                print("[QA] add alt to img '{}'".format(img["src"]))
        # override file with replacement
        with open(filepath, "w", encoding="utf-8") as data_file:
            data_file.write(soup.prettify())
        print("End {}".format(filepath))
