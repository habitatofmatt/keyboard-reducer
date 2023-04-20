import json
from collections import defaultdict


def extract_keys(raw):
    id_ = []
    meta = defaultdict(lambda: {"id": []})

    for line_no, line in enumerate(raw.splitlines()):
        if not (line := line.strip()):
            continue

        for col_no, col in enumerate(line.split()):
            if set(col) == set("-"):
                continue

            key = f"{col_no},{line_no}"

            meta[key]["id"].append(len(id_))
            id_.append(col)

    return json.dumps({"id": id_, "meta": meta})


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
