import json


def extract_labels(raw):
    labels = {}

    for line in raw.splitlines():
        if not (line := line.strip()):
            continue

        try:
            id_, label = line.split(maxsplit=1)
        except ValueError:
            id_, label = line, ""

        labels[id_] = label

    return json.dumps(labels)
