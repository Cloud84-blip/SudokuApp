import sys

with open(sys.argv[1], "r") as file:
    text = file.read()
    print(len(text.split("==================")[1].split(' ')))
    # print(" ".join(text.split("==================")[1].split(' ')).replace("\n", ""))
    file.close()