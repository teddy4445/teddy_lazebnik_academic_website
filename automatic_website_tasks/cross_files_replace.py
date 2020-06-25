# library imports
import os
import glob
import argparse

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Parameters for run')
    parser.add_argument('--folder', type=str, help="Absulate folder's path to run on")
    parser.add_argument('--ft', type=str, help='file type (extention) to run on', default="html")
    parser.add_argument('--source', type=str, help='the original string we wish to replace')
    parser.add_argument('--target', type=str, help='the string we wish to replace with')
    parser.add_argument('--qa', type=bool, help='print qa messages')
    args = parser.parse_args()

    # default parameters' values
    file_type = args.ft if args.ft is not None else 'html'
    folder = args.folder if args.folder is not None else os.path.join("..", os.path.dirname(__file__))
    qa = args.qa if args.qa is not None else True

    source = args.source if args.source is not None else ""
    target = args.target if args.target is not None else ""

    if not (source == "" or target == ""):

        source_links = source.replace("href=\"", "href=\"../")
        target_links = target.replace("href=\"", "href=\"../")

        # run over all the files from the needed file type in the needed folder
        for filepath in glob.iglob(os.path.join(folder, "**", "*.{}".format(file_type)), recursive=True):
            print("Start {}".format(filepath))
            data = ""
            # read file
            with open(filepath, "r", encoding="utf-8") as data_file:
                data = data_file.read()
            # replace
            if qa:
                print("[QA] Source found {} times".format(data.count(source)))
                print("[QA] Source (../ links) found {} times".format(data.count(source_links)))
            data = data.replace(source, target)
            data = data.replace(source_links, target_links)
            # override file with replacement
            with open(filepath, "w", encoding="utf-8") as data_file:
                data_file.write(data)
            print("End {}".format(filepath))
    else:
        print("Error: you need to enter source and target string to use this method")
