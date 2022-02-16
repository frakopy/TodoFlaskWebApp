
class database():

    def get_tasks(self, mysql):
        try:
            cursor =  mysql.connection.cursor()
            cursor.execute("SELECT * FROM tasks") 
            data =  cursor.fetchall()
            cursor.close()
            return data
        except Exception as e:
            return e

    def add_task(self, task_name, task_comment, mysql):
        try:
            cursor =  mysql.connection.cursor()
            cursor.execute("INSERT INTO tasks (task_name, task_comment) VALUES ('{}', '{}')".format(task_name, task_comment)) 
            mysql.connection.commit()
            cursor.close()
            return 200
        except Exception as e:
            return 600