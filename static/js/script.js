'use strict'

const form = document.getElementById('form')
const tbody = document.getElementById('tbody')
const labelNotify = document.getElementById('notify')


form.addEventListener('submit', (event) => {
    event.preventDefault();
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
            labelNotify.textContent = 'The task was successfully added'
        }else{
            alert('UPSS!!!, Something went wrong')
        }

        setTimeout(() => {window.location}, 3000)
    })
})