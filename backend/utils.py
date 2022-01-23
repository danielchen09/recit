import firebase_admin
from firebase_admin import db
from google.cloud import storage
import os
import json


def setup_firebase():
    cred_obj = firebase_admin.credentials.Certificate(
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"])

    firebase_admin.initialize_app(cred_obj, {
        "databaseURL": "https://recit-1742e-default-rtdb.firebaseio.com/"
    })


def dowload_file(blob_name, destination):
    storage_client = storage.Client()
    bucket = storage_client.bucket("recit-1742e.appspot.com")
    blob = bucket.blob(blob_name)
    blob.download_to_filename(destination)


def write_ocr(ocr_result, owner):
    ref = db.reference("/receipts/")
    products = []
    for key, value in ocr_result.items():
        if key == "TOTAL":
            continue

        products.append(
            {
                "name": key,
                "price": value["price"] * value["qty"]
            }
        )

    return ref.push(
        {
            "total": ocr_result['TOTAL']['price'],
            "owner": owner,
            "products": products
        }
    )


def get_user(users, name):
    for i, user in enumerate(users):
        if user["name"] == name:
            return i

    return -1


def add_user(receipts_id, product_idx, name):
    ref = db.reference("/receipts/" + receipts_id +
                       "/products/" + product_idx + "/")
    data = ref.get()
    users = []
    if "users" in data:
        users = data["users"]

    index = get_user(users, name)
    if index == -1:
        users.append({"name": name, "qty": 0})
    
    users[index]["qty"] += 1

    ref.child("users").set(users)

