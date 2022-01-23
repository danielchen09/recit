from flask import Flask, request, jsonify, redirect
from ocr import parse_receipt
import os
from utils import setup_firebase, write_ocr
import base64


app = Flask(__name__)

# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.abspath(
#     '/home/leechangwook0621/recit-1742e-firebase-adminsdk-9smyz-f063fa23f0.json')
setup_firebase()


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/ocr", methods=["POST"])
def ocr():
    data = request.get_json()
    filename = 'imgs/' + data["filename"]
    result = parse_receipt(filename)
    print(result)
    push_ref = write_ocr(result)
    print(push_ref.key)

    return redirect("https://google.com", code=301)

@app.route("/upload", methods=["POST"])
def upload_image():
    file = request.files['file']
    file.save("./imgs/" + file.filename)

    return 'file saved successfully', 200
