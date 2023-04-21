import json
from itertools import zip_longest


def bridge(fn):
    def inner(raw_input):
        input_ = json.loads(raw_input)
        output = fn(**input_)
        return json.dumps(output)

    return inner


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
        yield zip_longest(*row_set, fillvalue="")


def _get_key_data(x, y, raw):
    """Extract IDs and props from list of comma-separated strings"""

    ids = []
    x_offset = 0
    y_offset = 0

    for layer_key in raw:
        raw_id, *raw_props = layer_key.split(",")
        raw_id = raw_id.replace("-", "")

        ids.append(raw_id or None)

        for prop in raw_props:
            if prop == "x":
                x_offset = 0.5
            elif prop == "y":
                y_offset = 0.5

    if not any(ids):
        return None

    output = [x + x_offset, y + y_offset, ids]
    return output


@bridge
def extract_keys(*, raw):
    layers = _iter_layers_from_raw(raw)
    layers_transposed = _iter_layers_transposed(layers)

    ids = set()
    data = []

    for y, row in enumerate(layers_transposed):
        for x, col in enumerate(row):
            if key_data := _get_key_data(x, y, col):
                ids.update(key_data[2])
                data.append(key_data)

    width = max((d[0] for d in data), default=-1) + 1
    height = max((d[1] for d in data), default=-1) + 1

    return {"ids": list(ids), "data": data, "width": width, "height": height}


@bridge
def extract_labels(*, raw):
    labels = {}

    for line in raw.splitlines():
        if not (line := line.strip()):
            continue

        try:
            id_, label = line.split(maxsplit=1)
        except ValueError:
            id_, label = line, ""

        labels[id_] = label

    return labels
