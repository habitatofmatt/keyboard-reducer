import json
from collections import defaultdict


def _iter_layers_from_raw(raw):
    current = []

    for line_no, line in enumerate(raw.splitlines()):
        if line := line.strip():
            current.append(line.split())
        else:
            if current:
                yield current
                current = []

    if current:
        yield current


def extract_keys(raw):
    layers = _iter_layers_from_raw(raw)
    return json.dumps(list(layers))

    id_ = []
    meta = defaultdict(lambda: {"id": []})

    for line_no, line in enumerate(raw.splitlines()):
        if not (line := line.strip()):
            continue

        for col_no, col in enumerate(line.split()):
            if set(col) == set("-"):
                continue

            key = str((col_no, line_no))

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
