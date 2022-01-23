from crypt import methods
from flask import Flask, request, jsonify, redirect
from ocr import parse_receipt
import os
from utils import setup_firebase, write_ocr


app = Flask(__name__)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.abspath(
   '/home/leechangwook0621/recit-1742e-firebase-adminsdk-9smyz-f063fa23f0.json')
setup_firebase()


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/ocr", methods=["POST"])
def ocr():
   print("test")
   print(request.form["owner"])
   print(request.get_json())
   file = request.files["file"]
   file.save("./imgs/" + file.filename)
   result = parse_receipt("./imgs/" + file.filename)
   print(result)
   push_ref = write_ocr(result, request.form["owner"])
   print(push_ref.key)

   return jsonify({"id": push_ref.key}), 200

# @app.route("/select", methods=["POST"])
# def add_user_product():
    
@app.route("/redirect", methods=["GET"])
def redirect_uri():
    return redirect("exp://28-rrp.alwinyen.recit.exp.direct", 301)