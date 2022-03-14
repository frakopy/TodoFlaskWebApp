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
    # tasks_data  = db.get_tasks(mysql)
    # return render_template('index.html', tasksData = tasks_data)
    return render_template('index.html')

@app.route('/get_tasks')
def get_tasks():
    tasks_data  = db.get_tasks(mysql)
    return jsonify(tasksData = tasks_data)

@app.route('/add_new_task', methods=['POST'])
def add_task():
    task_data = request.json
    task_name = task_data['taskName']
    task_comment = task_data['taskComment']
    task_id = task_data['taskId']
    result_code = db.add_task(task_id, task_name, task_comment ,mysql)
    return jsonify(code_response = result_code)

@app.route('/delete_task', methods=['POST'])
def delete_task():
    task_data = request.json
    task_id = task_data['taskId']
    result_code = db.delete_task(task_id ,mysql)
    return jsonify(code_response = result_code)

@app.route('/update_task', methods=['POST'])
def update_task():
    data_to_update =  request.json
    task_name = data_to_update['taskName']
    task_comment = data_to_update['taskComment']
    task_id = data_to_update['taskId']
    result_code = db.update_task(task_name, task_comment, task_id, mysql)
    return jsonify(code_response = result_code)

@app.route('/set_completed_task', methods=['POST'])
def set_completed_task():
    data_to_update =  request.json
    task_completed_value = data_to_update['taskCompletedValue']
    task_id = data_to_update['taskId']
    result_code = db.set_completed_task(task_completed_value, task_id, mysql)
    return jsonify(code_response = result_code)

@app.route('/set_important', methods=['POST'])
def set_important():
    data_received =  request.json
    important = data_received['important']
    print(f'the important set is {important}')
    task_id = data_received['taskId']
    result_code = db.set_important(task_id, important, mysql)
    return jsonify(code_response = result_code)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port = 8089)