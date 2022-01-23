from crypt import methods
from flask import Flask, request, jsonify, redirect
from ocr import parse_receipt
import os
from utils import setup_firebase, write_ocr, add_user, remove_user


app = Flask(__name__)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.abspath(
    '/home/leechangwook0621/recit-1742e-firebase-adminsdk-9smyz-f063fa23f0.json')
setup_firebase()


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/ocr", methods=["POST"])
def ocr():
    file = request.files["file"]
    file.save("./imgs/" + file.filename)
    result = parse_receipt("./imgs/" + file.filename)
    print(result)
    push_ref = write_ocr(result, request.form["owner"])
    print(push_ref.key)

    return jsonify({"id": push_ref.key}), 200


@app.route("/select", methods=["POST"])
def select_product():
    data = request.get_json()
    add_user(data["receipt_id"], data["product_idx"],
             data["name"])

    return '', 200


@app.route("/deselect", methods=["POST"])
def deselect_product():
    data = request.get_json()
    remove_user(data["receipt_id"], data["product_idx"],
             data["name"])

    return '', 200


@app.route("/redirect", methods=["GET"])
def redirect_uri():
    return redirect("exp://28-rrp.alwinyen.recit.exp.direct", 301)
