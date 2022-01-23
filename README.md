# Recit
## Try it out!
Download Expo from [Google PlayStore](https://play.google.com/store/apps/details?id=host.exp.exponent) or [Apple App Store](https://apps.apple.com/us/app/expo-go/id982107779), then use the following link to launch the app:
exp://28-rrp.alwinyen.recit.exp.direct
<br/>
<img src="https://i.ibb.co/hB3R8k3/qr-code.png" data-canonical-src="https://i.ibb.co/hB3R8k3/qr-code.png" width="200" height="200" />


Trouble shooting on Andriod: If share link cannot be opened, first open the Expo app then click the link again.

## Inspiration
Oftentimes, we felt troubled with the long and complex grocery shopping receipts with our roommates or sharing several dishes in a dinner gathering. The receipts are long, taxes and tips are confusing, and there are too many shared items that are complex when splitting the money. Therefore, we created Recit, an app to help list and split the money for grocery shopping trips or large group dinner gatherings. 

## What it does
The receipt owner can first take a photo of the receipt. Then, Recit will show a list of items with their respected cost for other users to choose from. After users chose what they are responsible for in the list, Recit will then calculate and display the amount of money that each user needs to pay to the user.

## How we built it
We used Google's Could VIsion OCR API to get raw data from receipt images, i.e. all text on image and corresponding coordinates. We then use those raw data to get the price for each items on the receipt. We utilize Flask to store items information in Firebase realtime database and use React-Native to build the app where users can claim their items and see the price they need to pay.

## Challenges we ran into
1. Cloud Vision OCR produce different result when recognizing image from local storage and image taken in our phone app.
2. Create share link where all users with the link can access the same receipt information.
3. Render frontend interface in realtime.

## Accomplishments that we're proud of
We are proud that we create a complete and functional application that would be useful on daily bases in only 48 hours with no prior experiences in Firebase or Reactive-Native! 

## What we learned
We learned how to handle realtime data using Firebase and React-Native, where frontend will automatically render new information store to the database. We also learn how to use Google Vision API to do OCR and how to transform and organzie raw data into useful and 

## What's next for Recit
- Add user account system to share with groups easier.
- Link to banking API (i.e., Zelle, Venmo) to send money through Recit.

### Prerequisites

* python3.8
  ```sh
  sudo apt install python3.8
  ```
* virtualenv
  ```sh
  pip install virtualenv
  ```
* python3.8 venv
  ```sh
  sudo apt install python3.8-venv
  ```

## Getting Started

### Installation
1. Go to `backend` directory
2. Create virtual environment
   ```sh
   python3 -m venv env
   ```
3. Activate virtual environment
   ```sh
   source env/bin/activate
   ```
4. Install python packages
   ```sh
   pip install -r requirements.txt
   ```

## Usage
In the `backend` directory, run:

### `flask run`
Runs the server in the development mode.
<br /> Open [http://127.0.0.1:5000/](http://127.0.0.1:5000/) to view it in the browser.

