import json
from collections import defaultdict
from itertools import zip_longest


def _iter_layers_from_raw(raw):
    """Convert raw data into layer -> row -> col nested arrays"""

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


def _iter_layers_transposed(layers):
    """Convert layer -> row -> col into row -> col -> layer"""

    for row_set in zip_longest(*layers, fillvalue=[]):
        yield zip_longest(*row_set, fillvalue="-")


def extract_keys(raw):
    layers = _iter_layers_from_raw(raw)
    layers_transposed = _iter_layers_transposed(layers)

    values = []
    meta = defaultdict(lambda: {"v": []})

    for y, row in enumerate(layers_transposed):
        for x, col in enumerate(row):
            key = f"{x},{y}"

            for id_ in col:
                if set(id_) == set("-"):
                    meta[key]["v"].append(None)
                else:
                    meta[key]["v"].append(len(values))
                    values.append(id_)

    return json.dumps({"values": values, "meta": meta})


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
