import pathlib
import json
path = str(pathlib.Path("~/Downloads/pronoy-chopra.ghost.2020-05-05.json").expanduser())

with open(path, "r") as json_file:
    data = json.loads(json_file.read())


posts = data['db'][0]['data']['posts']

