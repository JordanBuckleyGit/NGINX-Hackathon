from flask import Flask, render_template, session, redirect, url_for, g, request
from database import get_db, close_db
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash
from forms import randoForm
from functools import wraps
import os

app = Flask(__name__)
app.teardown_appcontext(close_db)
app.config["SECRET_KEY"] = "jsonDerulo"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["UPLOAD_FOLDER"] = "static/images"
Session(app)

@app.route('/logs')
def show_logs():
    log_path = os.path.join(app.root_path, 'access.log')
    if not os.path.exists(log_path):
        return "Log file not found.", 404

    with open(log_path, 'r') as f:
        lines = f.readlines()
    return "<br>".join(line.strip() for line in lines)
