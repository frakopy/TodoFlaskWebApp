from flask import Flask
from flask import request
from flask import render_template
from flask import redirect
from flask import url_for
from flask import jsonify
from db import database
from flask_mysqldb import MySQL


app = Flask(__name__)

app.config['MYSQL_HOST'] = 'us-cdbr-east-05.cleardb.net'
app.config['MYSQL_USER'] = 'bf702d51c5fe8b'
app.config['MYSQL_PASSWORD'] = '95c5b72b'
app.config['MYSQL_DB'] = 'heroku_576655c06b722f3'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor' #To get the data result as dictionary instead of touple

mysql = MySQL(app)

db = database()

@app.route('/')
def index():
    tasks_data  = db.get_tasks(mysql)
    return render_template('index.html', tasksData = tasks_data)


@app.route('/add_new_task', methods=['POST'])
def add_task():
    task_data = request.json
    task_name = task_data['taskName']
    task_comment = task_data['taskComment']
    result_code = db.add_task(task_name,task_comment ,mysql)
    return jsonify(code_response = result_code)

@app.route('/data_tasks')
def data_tasks():
    data  = db.get_tasks(mysql)
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port = 8089)