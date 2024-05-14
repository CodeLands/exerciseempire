# To activate virtual environment
## On Windows:
myenv\Scripts\activate

## On macOS and Linux:
source myenv/bin/activate

# To install dependencies
pip install -r requirements.txt

# To run Flask server
flask --env-file .env run

# To run PyTest tests
pytest