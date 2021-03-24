from flask import Flask

app = Flask(__name__)


@app.route('/')
def hello_world():
    return '<h1> RecMe Internal API</h1><p>Please contact Shahan Neda for more info </p><a href="https://shahan.ca"/>Shahan.ca</a>'

