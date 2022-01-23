from crypt import methods
from flask import Flask, request, jsonify, redirect
from ocr import parse_receipt
import os
from utils import setup_firebase, write_ocr, add_user, remove_user, add_user_to_receipt
from PIL import Image, ImageOps


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
    filename = "./imgs/" + file.filename
    file.save(filename)
    image = Image.open(filename)
    fixed_image = ImageOps.exif_transpose(image)
    fixed_image.save(filename, quality=30)

    result = parse_receipt(filename)
    print(result)
    push_ref = write_ocr(result, request.form["owner"].lower())
    print(push_ref.key)

    return jsonify({"id": push_ref.key}), 200


@app.route("/select", methods=["POST"])
def select_product():
    data = request.get_json()
    add_user(data["receipt_id"], data["product_idx"],
             data["name"].lower())

    return 'success', 200


@app.route("/deselect", methods=["POST"])
def deselect_product():
    data = request.get_json()
    remove_user(data["receipt_id"], data["product_idx"],
                data["name"].lower())

    return 'success', 200


@app.route("/redirect", methods=["GET"])
def redirect_uri():
    id = request.args.get("receiptId")
    return redirect("exp://28-rrp.alwinyen.recit.exp.direct/--/login/" + id, 301)


@app.route("/add-users", methods=["POST"])
def add_receipt_user():
    data = request.get_json()
    add_user_to_receipt(data["receipt_id"], data["name"].lower())

    return 'success', 200
