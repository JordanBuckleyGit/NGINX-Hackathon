from flask import Flask, render_template, session, redirect, url_for, g, request
from database import get_db, close_db
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash
from forms import LogFilterForm
from functools import wraps
import os

app = Flask(__name__)
app.teardown_appcontext(close_db)
app.config["SECRET_KEY"] = "jsonDerulo"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["UPLOAD_FOLDER"] = "static/images"
Session(app)

@app.route('/')
def index():
    form = LogFilterForm()
    log_lines = []
    return render_template('index.html', form=form, log_lines=log_lines)


@app.route('/logs', methods=['GET', 'POST'])
def show_logs():
    form = LogFilterForm()
    log_path = os.path.join(app.root_path, 'access.log')
    log_lines = []

    if os.path.exists(log_path):
        with open(log_path, 'r') as f:
            print(f.readlines())
            log_lines = f.readlines()
    print("LOG LINES:", log_lines)

    if form.validate_on_submit():
        if form.ip_address.data:
            log_lines = [line for line in log_lines if form.ip_address.data in line]
        if form.status_code.data:
            log_lines = [line for line in log_lines if form.status_code.data in line]

    return render_template('index.html', form=form, log_lines=log_lines)