import os
import re

MIN_TEXT_LEN = 2
MAX_TEXT_LEN = 20
SPLIT_THRESHOLD = 40
is_price = re.compile('^[$-]?[0-9]+\\.[0-9][0-9]$')

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.abspath('api_key/recit-1742e-firebase-adminsdk-9smyz-f063fa23f0.json')
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

    response = client.document_text_detection(image=image)
    documents = response.full_text_annotation
    bounds = []
    for block in documents.pages[0].blocks:
        for paragraph in block.paragraphs:
            for word in paragraph.words:
                text = ''
                for symbol in word.symbols:
                    text += symbol.text
                vertices = ([(vertex.x, vertex.y) for vertex in symbol.bounding_box.vertices])
                bounds.append({
                    'text': text,
                    'center': ((vertices[0][0] + vertices[3][0]) / 2, (vertices[1][1] + vertices[2][1]) / 2)
                })

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
    if len(name) < 1:
        return None
    name = ' '.join(name)
    if name.lower() in EXCLUDE_WORDS:
        return None
    if 'total' in name.lower():
        name = 'TOTAL'
    if 'tax' in name.lower():
        name = 'TAX'
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
            print(' '.join(it['text'] for it in processing))
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
    tax_percentage = 1
    if 'TOTAL' not in items:
        items['TOTAL'] = {
            'price': sum(items[item]['price'] * items[item]['qty'] for item in items.keys() if item != 'TAX')
                     + (items['TAX']['price'] if 'TAX' in items else 0),
            'qty': 1
        }
    if 'TAX' in items:
        tax_percentage = items['TOTAL']['price'] / (items['TOTAL']['price'] - items['TAX']['price'])
        del items['TAX']
    for item in items.keys():
        if item != 'TOTAL':
            items[item]['price'] *= tax_percentage
    return items