from flask import Flask, request
from ocr import parse_receipt
import os
from utils import setup_firebase, dowload_file


app = Flask(__name__)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.abspath('api_key/recit-1742e-firebase-adminsdk-9smyz-f063fa23f0.json')
setup_firebase()

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/ocr", methods=['POST'])
def ocr():
    data = request.get_json()
    file = 'imgs/' + data["uri"]
    dowload_file(data["uri"], file)
    result = parse_receipt(file)
    print(result)
    return '', 200