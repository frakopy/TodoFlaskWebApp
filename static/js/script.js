'use strict'

//-----------------Define variables which contains html elements ----------
const form = document.getElementById('form')
const tbody = document.getElementById('tbody')
const h1 = document.querySelector('header > h1')
const inputTaskName = document.getElementById('input-taskName')
const textAreaComments = document.getElementById('textarea-taskComments')
const btnAddTask = document.getElementById('btn-task')
const hidedElements = Array.from(document.querySelectorAll('.hide'))
let idTask = ''
//-----------------------------------------------------------------------


//Load task from DB
const load_task = async () => {
    const getTasks = await fetch('/get_tasks')
    const result = await getTasks.json()
    return result
}

load_task().then(result => {
    const fragment = document.createDocumentFragment()
    result.tasksData.map(task => {
        const completed = task.task_completed
        let taskChecked
        completed === 'yes' ? taskChecked = "checked" : taskChecked = ''
        const importantTask =  task.important
        let classImportant
        importantTask === 'yes' ? classImportant = " set-important-color" : classImportant = '' //The space in classImportant = " .set-important-color" is very important
        const tr =  document.createElement('tr')
        tr.setAttribute('data-task-id', `${task.id_task}`)
        tr.innerHTML = `
            <td class="name-task${classImportant}" data-task-id="${task.id_task}">
                <input class="task-name input-checkbox" type="checkbox" name="task-${task.id_task}" data-task-id="${task.id_task}" ${taskChecked}>
                <label class="task-name text-task" for="task-${task.id_task}" data-task-id="${task.id_task}">${task.task_name}</label>
            </td>
            <td class="comentaries${classImportant}" data-task-id="${task.id_task}">
                <label class="comments" data-task-id="${task.id_task}">${task.task_comment}</label>
            </td>
            <td class="images${classImportant}" data-task-id="${task.id_task}">
                <img class="edit" src="/static/img/edit.png" alt="edit-image" data-task-id="${task.id_task}">
            </td>
            <td class="images${classImportant}" data-task-id="${task.id_task}">
                <img class="delete" src="/static/img/delete.png" alt="delete-image" data-task-id="${task.id_task}">
            </td>
        `
        fragment.appendChild(tr)
    })
    tbody.appendChild(fragment)

    //Show all elements once all tr has been added to tbody element, so we remove the class that hid them
    hidedElements.map(element => {element.classList.remove('hide')})

})

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
            setTimeout(() => {inputTaskName.value = ''}, 2000)
        }
        
        else{

            const taskList = Array.from(document.querySelectorAll('.name-task'))
            let newTaskId
            //If there is not any task we can not get the last task id so we create it with value = 1
            if(taskList.length === 0){
                newTaskId = 1
            }else{
                const lastTd = taskList[taskList.length - 1]
                const lastTaskId = Number(lastTd.dataset.taskId)
                newTaskId = lastTaskId + 1
            }

            //-----------------------Create the new row with it's tds-------------------------------------------------------------
            const new_tr =  document.createElement('tr')
            new_tr.setAttribute('data-task-id', `${newTaskId}`)
            new_tr.classList.add('blink') //This class is for play an animation background and also is added to td task name and td task comments in the innerHtml
            new_tr.innerHTML = `
                <td class="name-task blink" data-task-id="${newTaskId}">
                    <input class="task-name input-checkbox" type="checkbox" name="task-${newTaskId}" data-task-id="${newTaskId}">
                    <label class="task-name text-task" for="task-${newTaskId}" data-task-id="${newTaskId}">${taskName}</label>
                </td>
                <td class="comentaries blink" data-task-id="${newTaskId}">
                    <label class="comments" data-task-id="${newTaskId}">${taskComment}</label>
                </td>
                <td class="images" data-task-id="${newTaskId}">
                    <img class="edit" src="/static/img/edit.png" alt="edit-image" data-task-id="${newTaskId}">
                </td>
                <td class="images" data-task-id="${newTaskId}">
                    <img class="delete" src="/static/img/delete.png" alt="delete-image" data-task-id="${newTaskId}">
                </td>
            `
            //Add the new row created to the tbody of the table element
            tbody.insertAdjacentElement('afterbegin', new_tr)

            //Reset the form for clear the text from input and textarea boxes.
            form.reset() 

            //---------------------------------------------------------------------------------------------

            const dataToSend = {
                taskId : newTaskId,
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
                    //Changing header text for notify the user
                    changeHeaderText('Adding the task to DB...')
                }else{
                    alert('UPSS!!!, Something went wrong')
                }
            })
        }

    }else if(BtnId === 'btn-edit'){

        //Getting the label task name and the label task comment for change their text 
        const taskName = document.querySelector(`td[data-task-id="${idTask}"] > .text-task`)
        const taskComments = document.querySelector(`td[data-task-id="${idTask}"] > .comments`)

        //Get the row that match with the task id for temporally change the background 
        const row = document.querySelector(`tr[data-task-id="${idTask}"]`)

        //Getting the text written  by the user in the form element
        const textTaskName = form.elements['task-name'].value
        const textTaskComment = form.elements['task-comments'].value

        //Changing the text content of the labels in the table row that contains the information about the task name and task comment
        taskName.textContent = textTaskName
        taskComments.textContent = textTaskComment

        //Change temporally the background of the row and labels text that has been modified
        row.classList.add('modified-task')
        taskName.classList.add('modified-task')
        taskComments.classList.add('modified-task')
        
        
        //Removing save and cancel buttons
        form.removeChild(btnSave)
        form.removeChild(btnCancel)

        //Adding add task button
        form.appendChild(btnAddTask)

         //Reset the form for clear the text from input and textarea boxes.
        form.reset() 

        //After 5 seconds remove the background color #07004D
        setTimeout(() => {
            row.classList.remove('modified-task')
            taskName.classList.remove('modified-task')
            taskComments.classList.remove('modified-task')
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
        //Reset the form for clear the text from input and textarea boxes.
        form.reset() 
        
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
        const taskName = document.querySelector(`td[data-task-id="${idTask}"] > .text-task`).textContent
        const taskComments = document.querySelector(`td[data-task-id="${idTask}"] > .comments`).textContent
        
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
        textAreaComments.value = taskComments
    
        //Setting focus to the input where we are going to write the task name 
        inputTaskName.focus()

    }else if(elementClassName === 'delete'){
        const trToDelete = document.querySelector(`tr[data-task-id="${idTask}"]`)
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
    const classElementClicked =  event.target.className
    const taskId = event.target.getAttribute('data-task-id') //Getting the task id
    const tr = document.querySelector(`tbody > tr[data-task-id="${taskId}"]`)
    const tdList = document.querySelectorAll(`td[data-task-id="${taskId}"]`)
    const tdNameTask = tdList[0]
    const tdCommentTask = tdList[1]
    const tdimgEdit = tdList[2]
    const tdimgDelete = tdList[3]
    let important = ''

    const listClassName = ['name-task', 'task-name text-task', 'name-task set-important-color']

    if(listClassName.includes(classElementClicked)){

        //Add class for chaghe the color text of the labels if labels dosen't has the class else remove the class
        //Also we add the class for the img elements because in CSS we apply a rule for all elements that has
        //set-important-color when hover a tr element
        tdNameTask.classList.toggle('set-important-color')
        tdCommentTask.classList.toggle('set-important-color')
        tdimgEdit.classList.toggle('set-important-color')
        tdimgDelete.classList.toggle('set-important-color')

        if(tdNameTask.classList.contains('set-important-color') && tdCommentTask.classList.contains('set-important-color')){
            important = 'yes'
        }else{
            important = 'no'
        }
        
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
                console.log('The priority was set successfully in the database')
            }else{
                console.log(`Ups something was wrong with the error ${resultCode}`)
            }
        })
    }
})