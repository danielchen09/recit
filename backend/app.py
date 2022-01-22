from flask import Flask
from ocr import parse_receipt

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/ocr", methods=['POST'])
def ocr():
    return