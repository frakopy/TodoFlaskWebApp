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
    
        const taskName = form.elements['task-name'].value
        const taskComment = form.elements['task-comments'].value
        
        //validating if the length value of the input where we write the task name is empty
        if(taskName.length === 0) { 
            inputTaskName.style.color = 'red'
            inputTaskName.value = 'This element can not be empty, please write your task here'
        }else{

            //Changing header text for notify the user
            changeHeaderText('Adding the task...')
            
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
        }

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
        row.style.background = '#FAF2F2'
        
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

// function for update task completed value in database:
const setCompletedTaskValue = (taskCompleted, idTask) => {
    const data = {
        taskCompletedValue : taskCompleted,
        taskId : idTask
    }

    const fetchSettings = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {"content-type": "application/json; charset=UTF-8"}
    }
    
    const sendRequest = async (fetchSettings) => {
        try {
            const result = await fetch('/set_completed_task', fetchSettings)
            const jsonResult =  result.json()
            return jsonResult
        }catch(error) {
            return error
        }
    }

    sendRequest(fetchSettings).then(jsonResult =>{
        if(jsonResult.code_response == 200){
            changeHeaderText('The task state changed in the DB')
        }else{
            alert('Ups something went wrong...')
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
    
    }else if(elementClassName.includes('input-checkbox')){
        const inputChecked = event.target.checked
        if(inputChecked){
            console.log('Send the request to data base')
            const taskCompleted = 'yes'
            setCompletedTaskValue(taskCompleted, idTask)
        }else{
            console.log('The input box is not checked')
            const taskCompleted = 'no'
            setCompletedTaskValue(taskCompleted, idTask)
        }
    }
})

tbody.addEventListener('dblclick', (event) => {
    const elementClassName =  event.target.className
    const taskId = event.target.getAttribute('data-task-id') //Getting the task id
    const tr = document.querySelector(`tbody > tr[data-task-id="${taskId}"]`)
    let important = ''
    if(elementClassName === 'name-task' || elementClassName === 'task-name text-task'){

        if(tr.classList.contains('set-important-color')){
            important = 'no'
        }else{
            important = 'yes'
        }

        //Add class for chaghe the background color of the row if table row dosen't has the class else remove the class
        tr.classList.toggle('set-important-color') 
        
        const data = {
            taskId : taskId,
            important : important
        }

        const fetchSettings = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {"content-type": "application/json; charset=UTF-8"}
        }

        const request = async (fetchSettings) => {
            try{
                const result = await fetch('/set_important', fetchSettings)
                const jsonResult =  await result.json()
                return jsonResult
            }catch(error) {
                return error
            }
        }
        
        request(fetchSettings).then( resultCode => {
            if(resultCode.code_response == 200 ){
                console.log('The priority was set as important in database successfully')
            }else{
                console.log(`Ups something was wrong with the error ${resultCode}`)
            }
        })
    }
})