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

@app.route('/', methods=['GET', 'POST'])
def index():
    form = LogFilterForm()
    db = get_db()
    query = "SELECT * FROM logs"
    filters = []
    params = []

    if form.validate_on_submit():
        if form.ip_address.data:
            filters.append("ip_address LIKE ?")
            params.append(f"%{form.ip_address.data}%")
        if form.status_code.data:
            filters.append("status_code = ?")
            params.append(form.status_code.data)
        if form.method.data:
            filters.append("request LIKE ?")
            params.append(f"{form.method.data} %")

    if filters:
        query += " WHERE " + " AND ".join(filters)
    query += " ORDER BY id DESC LIMIT 100"

    log_entries = db.execute(query, params).fetchall()

    return render_template('index.html', form=form, log_entries=log_entries)