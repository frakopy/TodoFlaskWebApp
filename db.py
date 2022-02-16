
class database():

    def get_tasks(self, mysql):
        try:
            cursor =  mysql.connection.cursor()
            cursor.execute("SELECT task_name, task_comment FROM tasks") 
            data =  cursor.fetchall()
            cursor.close()
            return data
        except Exception as e:
            return e