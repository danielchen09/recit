import os
import re

MIN_TEXT_LEN = 2
MAX_TEXT_LEN = 20
SPLIT_THRESHOLD = 40
is_price = re.compile('^[$-]?[0-9]+\\.[0-9][0-9]$')

with open('exclude_words.txt', 'r') as f:
    EXCLUDE_WORDS = f.read().split('\n')


def detect_text(path):
    """Detects text in the file."""
    from google.cloud import vision
    import io
    client = vision.ImageAnnotatorClient()

    with io.open(path, 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    response = client.text_detection(image=image)
    texts = response.text_annotations

    bounds = []
    for text in texts:
        if len(text.description) < MIN_TEXT_LEN or len(text.description) > MAX_TEXT_LEN:
            continue
        vertices = ([(vertex.x, vertex.y) for vertex in text.bounding_poly.vertices])
        bounds.append({
            'text': re.sub('[^a-zA-z0-9.]', '', text.description),
            'center': ((vertices[0][0] + vertices[3][0]) / 2, (vertices[1][1] + vertices[2][1]) / 2)
        })

    if response.error.message:
        raise Exception(
            '{}\nFor more info on error messages, check: '
            'https://cloud.google.com/apis/design/errors'.format(
                response.error.message))

    return bounds


def generate_item(raw_data):
    price = -1
    name = []
    for d in raw_data:
        if is_price.match(d['text']):
            price = float(re.sub('[^0-9.]', '', d['text']))
        else:
            name.append(d['text'])
    if price == -1:
        return None
    for word in name:
        if word.lower() in EXCLUDE_WORDS:
            return None
    name = ' '.join(name)
    if name.lower() in EXCLUDE_WORDS:
        return None
    if 'total' in name.lower():
        name = 'TOTAL'
    return {
        'name': name,
        'price': price
    }


def parse_receipt(path):
    bounds = sorted(detect_text(path), key=lambda x: x['center'][1])
    processing = []
    items = {}
    for i in range(1, len(bounds)):
        if bounds[i]['center'][1] - bounds[i - 1]['center'][1] > SPLIT_THRESHOLD:
            processing = sorted(processing, key=lambda x: x['center'][0])
            item = generate_item(processing)
            if item:
                if item['name'] not in items:
                    items[item['name']] = {
                        'price': item['price'],
                        'qty': 0
                    }
                items[item['name']]['qty'] += 1
            processing = []
        processing.append(bounds[i])

    return items