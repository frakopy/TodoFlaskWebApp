'use strict'

//Define variables which contains html elements:
const form = document.getElementById('form')
const tbody = document.getElementById('tbody')
const h1 = document.querySelector('header > h1')
const inputTaskName = document.getElementById('input-taskName')
const inputTaskComment = document.getElementById('input-taskComment')
const btnAddTask = document.getElementById('btn-task')

let idTask = ''

const changeHeaderText = (text) => {
    h1.textContent = text
    h1.style.color = 'White'
    setTimeout(() => {
        h1.textContent = 'TO DO APP BY FRANCO DEV'
        h1.style.color = '#03C4A1'
    }, 2000)
}

//code for add and edit tasks:
form.addEventListener('submit', (e) => {
    e.preventDefault()

    //Getting save and cancel buttons if they exist
    const btnSave = document.querySelector('form > #btn-edit')
    const btnCancel = document.querySelector('form > #btn-cancel')
    
    //Get the ID of Button clicked
    const BtnId = e.submitter.getAttribute('id') 
    
    if(BtnId === 'btn-task') {

        //Changing header text for notify the user
        changeHeaderText('Adding the task...')
    
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
            try{
                const response = await fetch('/add_new_task', fetchSettings)
                const jsonresponse = await response.json()
                return jsonresponse
            }catch(error) {
                return error
            }
            
        }
    
        sendData(fetchSettings).then(result => {
            if(result.code_response == 200) {
                console.log('The task was successfully added...')
            }else{
                alert('UPSS!!!, Something went wrong')
            }
    
            window.location = window.location
        })
    }else if(BtnId === 'btn-edit'){

        //Getting the label task name and the label task comment for change their text 
        const taskName = document.querySelector(`tbody > tr[data-task-id="${idTask}"] > td > .text-task`)
        const taskComments = document.querySelector(`tbody > tr[data-task-id="${idTask}"] > td > .comments`)

        //Get the row that match with the task id for temporally change the background 
        const row = document.querySelector(`tbody > tr[data-task-id="${idTask}"]`)

        //Getting the text written  by the user in the form element
        const textTaskName = form.elements['task-name'].value
        const textTaskComment = form.elements['task-comments'].value

        //Changing the text content of the labels in the table row that contains the information about the task name and task comment
        taskName.textContent = textTaskName
        taskComments.textContent = textTaskComment

        //Change temporally the background of the row that was modified
        row.style.background = '#07004D'
        
        //Removing save and cancel buttons
        form.removeChild(btnSave)
        form.removeChild(btnCancel)

        //Adding add task button
        form.appendChild(btnAddTask)

        //Clearing the text content of inputs boxes
        inputTaskName.value = ''
        inputTaskComment.value = ''

        //After 5 seconds remove the background color #07004D
        setTimeout(() => {
            row.style.background = ''
        }, 5000)

        //Sending the request to backend in order to update the database with the new information
        const data = {
            taskId: idTask,
            taskName: textTaskName,
            taskComment: textTaskComment
        }

        const fetchSettings = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {"content-type": "application/json; charset=UTF-8"}
        }

        const updateTask = async (fetchSettings) => {
            try{
                const response = await fetch('/update_task', fetchSettings)
                const jsonResponse = await response.json()
                return jsonResponse
            }catch (error) {
                return error
            }
            
        }

        updateTask(fetchSettings).then(response => {
            if(response.code_response == 200){
                changeHeaderText('Task updated from database')
            }else{
                alert('Was not possible update the task from database')
            }
        })

    }else if(BtnId == 'btn-cancel'){
        //Clearing the text content of inputs boxes
        inputTaskName.value = ''
        inputTaskComment.value = ''
        
        //Removing save and cancel buttons
        form.removeChild(btnSave)
        form.removeChild(btnCancel)

        //Adding add task button
        form.appendChild(btnAddTask)
    }

})

// function for delete a task from database:

const delTask = (idTask) => {
    const data = {
        taskId: idTask
    }

    const fetchSettings = {
        method:'POST',
        body: JSON.stringify(data),
        headers: {"content-type": "application/json; charset=UTF-8"}
    }

    const sendRequest = async (fetchSettings) => {
        try{
            const result = await fetch('/delete_task', fetchSettings)
            const jsonresult = await result.json()
            return jsonresult
        }catch(error){
            return error
        }

    }

    sendRequest(fetchSettings).then(jsonresult => {
        if(jsonresult.code_response == 200){
            changeHeaderText('Task deleted from DataBase')
        }else{
            alert('was not possible to delete the task from DB')
        }
    })

}

//Add event listener to tbody tag for propagate this event to all rows that are child from tbody
tbody.addEventListener('click', (event) => {
    const elementClassName = event.target.className //Getting class name from the element that we clicked
    idTask = event.target.getAttribute('data-task-id') //Getting the task id
    if(elementClassName === 'edit'){
        //Getting task Name and comments from table
        const taskName = document.querySelector(`tbody > tr[data-task-id="${idTask}"] > td > .text-task`).textContent
        const taskComments = document.querySelector(`tbody > tr[data-task-id="${idTask}"] > td > .comments`).textContent
        
        //Creating the new buttons save and cancel
        const btnSave = document.createElement('button')
        const btnCancel = document.createElement('button')
        btnSave.innerHTML = '<span>Save</span>'
        btnCancel.innerHTML = '<span>Cancel</span>'
        btnSave.setAttribute('id', 'btn-edit')
        btnCancel.setAttribute('id', 'btn-cancel')

        //Removing button add task
        form.removeChild(btnAddTask)
        
        //Apending the 2 buttons save and cancel
        form.appendChild(btnSave)
        form.appendChild(btnCancel)
        
        //Writing the task name and tasck comments in the input boxes
        inputTaskName.value = taskName
        inputTaskComment.value = taskComments
    
        //Setting focus to the input where we are going to write the task name 
        inputTaskName.focus()

    }else if(elementClassName === 'delete'){
        const trToDelete = document.querySelector(`tbody > tr[data-task-id="${idTask}"]`)
        tbody.removeChild(trToDelete) //Remove row task from DOM
        delTask(idTask) //Call function for remove task from DB
    }
})

const pty = ''
const pty = ''
const pty = ''
const pty = ''
const pty = ''
const pty = ''
const pty = ''
const pty = ''
const pty = ''