# library imports
import os
import glob
import argparse

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Parameters for run')
    parser.add_argument('--folder', help="Absulate folder's path to run on")
    parser.add_argument('--ft', help='file type (extention) to run on', default="html")
    parser.add_argument('--source', help='the original string we wish to replace')
    parser.add_argument('--target', help='the string we wish to replace with')
    args = parser.parse_args()

    # default parameters' values
    file_type = args.ft if args.ft is not None else 'html'
    folder = args.folder if args.folder is not None else os.path.join("..", os.path.dirname(__file__))

    # run over all the files from the needed file type in the needed folder
    for filepath in glob.iglob(os.path.join(folder, "**", "*.{}".format(file_type)), recursive=True):
        print(filepath)
