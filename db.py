
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


    def update_task(self, task_name, task_comment, task_id, mysql):
        try:
            cursor =  mysql.connection.cursor()
            cursor.execute("UPDATE tasks SET task_name='{}', task_comment='{}' WHERE id_task = '{}'".format(task_name, task_comment, task_id)) 
            mysql.connection.commit()
            cursor.close()
            return 200
        except Exception as e:
            print(e)
            return 600

    def delete_task(self, id_task, mysql):
        try:
            cursor =  mysql.connection.cursor()
            id_task = int(id_task)
            cursor.execute("DELETE FROM tasks where (id_task = {})".format(id_task))
            mysql.connection.commit()
            cursor.close()
            return 200
        except Exception as e:
            print(e)
            return 600