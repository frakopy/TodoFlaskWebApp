'use strict'

//Define variables which contains html elements:
const form = document.getElementById('form')
const tbody = document.getElementById('tbody')
const labelNotify = document.getElementById('notify')

//code for send and add tasks:
form.addEventListener('submit', (event) => {
    event.preventDefault();
    labelNotify.textContent = 'Adding the task...'
    const taskName = form.elements['task-name'].value
    const taskComment = form.elements['task-comments'].value
    
    const dataToSend = {
        taskName: taskName,
        taskComment: taskComment
    }

    const fetchSettings = {
        method : 'POST',
        body: JSON.stringify(dataToSend),
        headers: {"content-type": "application/json; charset=UTF-8"}
    }

    const sendData = async (fetchSettings) => {
        const response = await fetch('/add_new_task', fetchSettings)
        const jsonresponse = await response.json()
        return jsonresponse
    }

    sendData(fetchSettings).then(jsonresponse => {
        if(jsonresponse.code_response == 200) {
            console.log('The task was successfully added...')
            // labelNotify.textContent = 'The task was successfully added...'
        }else{
            alert('UPSS!!!, Something went wrong')
        }

        setTimeout(() => {window.location = window.location}, 1000)
    })
})

// code for delete a task:

const delTask = (taskId) => {
    const data = {
        taskId: taskId
    }

    const fetchSettings = {
        method:'POST',
        body: JSON.stringify(data),
        headers: {"content-type": "application/json; charset=UTF-8"}
    }

    const sendRequest = async (fetchSettings) => {
        const result = await fetch('/delete_task', fetchSettings)
        const jsonresult = await result.json()
        return jsonresult
    }

    sendRequest(fetchSettings).then(jsonresult => {
        if(jsonresult.code_response == 200){
            labelNotify.textContent = 'The task was successfully deleted...' //change content for notity to the user
            setTimeout(() => {
                labelNotify.textContent = '' //Change the notification 1 secondo after the first change
            }, 2000)
        }else{
            alert('was not possible to delete the task from DB')
        }
    })

}

tbody.addEventListener('click', (event) => {
    const elementClassName = event.target.className
    if(elementClassName === 'edit'){
        const taskId = event.target.getAttribute('data-task-id')
    
    }else if(elementClassName === 'delete'){
        const taskId = event.target.getAttribute('data-task-id')
        const trToDelete = document.querySelector(`tbody > tr[data-task-id="${taskId}"]`)
        tbody.removeChild(trToDelete)
        delTask(taskId)
    }
})