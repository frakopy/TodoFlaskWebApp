'use strict'

//Define variables which contains html elements:
const form = document.getElementById('form')
const tbody = document.getElementById('tbody')
const h1 = document.querySelector('header > h1')
const inputTaskName = document.getElementById('input-taskName')
const inputTaskComment = document.getElementById('input-taskComment')
const btnAddTask = document.getElementById('btn-task')

//code for send and add tasks:
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const btnAdd = document.querySelector('form > .btn-task')
    if(btnAdd != null) {
        console.log('The form contains the button add task')
    }else{
        console.log('The form do not contains the button add task')
    }
    h1.textContent = 'Adding the task...'
    h1.style.color = 'White'
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
        }else{
            alert('UPSS!!!, Something went wrong')
        }

        // window.location = window.location
    })
})

// function for delete a task from database:

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
            h1.textContent = 'The task was successfully deleted from DataBase'
            h1.style.color = 'White'
            setTimeout(() => {
                h1.textContent = 'TO DO APP BY FRANCO DEV'
                h1.style.color = '#03C4A1'
            }, 2000)
        }else{
            alert('was not possible to delete the task from DB')
        }
    })

}

//Add event listener to tbody tag for propagate this event to all rows that are child from tbody
tbody.addEventListener('click', (event) => {
    const elementClassName = event.target.className //Getting class name from the element that we clicked
    if(elementClassName === 'edit'){
        //Getting task Name and comments from table
        const taskId = event.target.getAttribute('data-task-id')
        const taskName = document.querySelector(`tbody > tr[data-task-id="${taskId}"] > td > .text-task`).textContent
        const taskComments = document.querySelector(`tbody > tr[data-task-id="${taskId}"] > td > .comments`).textContent
        
        //Creating the new buttons save and cancel
        const btnSave = document.createElement('button')
        const btnCancel = document.createElement('button')
        btnSave.innerHTML = '<span>Save</span>'
        btnCancel.innerHTML = '<span>Cancel</span>'
        //Removing button add task
        form.removeChild(btnAddTask)
        //Apending the 2 buttons save and cancel
        form.appendChild(btnSave)
        form.appendChild(btnCancel)
        
        //Writing the task name and tasck comments in the input boxes
        inputTaskName.value = taskName
        inputTaskComment.value = taskComments
    
    }else if(elementClassName === 'delete'){
        const taskId = event.target.getAttribute('data-task-id')
        const trToDelete = document.querySelector(`tbody > tr[data-task-id="${taskId}"]`)
        tbody.removeChild(trToDelete) //Remove row task from DOM
        delTask(taskId) //Call function for remove task from DB
    }
})