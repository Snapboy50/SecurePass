
from flask import Flask, render_template, request, jsonify

from database import (
    create_database,
    save_password_history,
    get_password_history,
    clear_password_history
)


app = Flask(
    __name__,
    template_folder="../templates",
    static_folder="../static",
    static_url_path="/static"
)


# Initialize database
create_database()


# ================================
# WEBSITE ROUTES
# ================================

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/password-checker")
def password_checker():
    return render_template("pages/password-checker.html")


@app.route("/password-generator")
def password_generator():
    return render_template("pages/password-generator.html")


@app.route("/security-tips")
def security_tips():
    return render_template("pages/security-tips.html")


@app.route("/about")
def about():
    return render_template("pages/about.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


# ================================
# SAVE PASSWORD HISTORY API
# ================================

@app.route("/api/password-history", methods=["POST"])
def save_password_result():

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Invalid request data."
        }), 400

    password_length = data.get("password_length")
    criteria_met = data.get("criteria_met")
    strength = data.get("strength")

    if (
        isinstance(password_length, bool)
        or not isinstance(password_length, int)
        or password_length < 1
        or password_length > 4096
    ):
        return jsonify({
            "success": False,
            "message": "Invalid password length."
        }), 400

    if (
        isinstance(criteria_met, bool)
        or not isinstance(criteria_met, int)
        or criteria_met < 0
        or criteria_met > 5
    ):
        return jsonify({
            "success": False,
            "message": "Invalid criteria count."
        }), 400

    if strength not in ["Weak", "Medium", "Strong"]:
        return jsonify({
            "success": False,
            "message": "Invalid password strength."
        }), 400

    save_password_history(
        password_length,
        criteria_met,
        strength
    )

    return jsonify({
        "success": True,
        "message": "Password checking result saved successfully!"
    })


# ================================
# RETRIEVE PASSWORD HISTORY API
# ================================

@app.route("/api/password-history", methods=["GET"])
def password_history():

    records = get_password_history()

    return jsonify({
        "success": True,
        "total_records": len(records),
        "history": records
    })

@app.route("/api/password-history", methods=["DELETE"])
def delete_password_history():
    deleted_count = clear_password_history()

    return jsonify({
        "success": True,
        "message": "Password history cleared successfully!",
        "deleted_count": deleted_count
    })


# ================================
# RUN APPLICATION
# ================================

if __name__ == "__main__":
    app.run(debug=True)
import os

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=False
    )