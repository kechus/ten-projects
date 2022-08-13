const $input = document.getElementById('first');
const $todolist = document.getElementById('todos');
const $footer = document.getElementById('footer');
const $remaining = document.getElementById('remaining');
let todos = [];
let filter = 'toditos';

const $toditos = document.getElementById('toditos');
const $active = document.getElementById('activos');
const $completed = document.getElementById('completed');

const toditos = ( ) =>{
    toggleOneButton('toditos');
    $active.classList.remove('chosen');
    $todolist.innerHTML = '';
    for(const todo of todos){
        createTodoInDocument(todo.value,todo.id,todo.completed);
    }
}

const active = ( )=>{
    toggleOneButton('activos');
    $todolist.innerHTML = '';
    const notCompleted = todos.filter((todo)=> !todo.completed)
    for(const todo of notCompleted){
        createTodoInDocument(todo.value,todo.id,todo.completed);
    }
}

const completed = ( ) =>{
    toggleOneButton('completed');
    $todolist.innerHTML = '';
    const completed = todos.filter((todo)=> todo.completed)
    for(const todo of completed){
        createTodoInDocument(todo.value,todo.id,todo.completed);
    }
}

const clean = () =>{
    const active = []
    for(const todo of todos){
        if(todo.completed){
            const $todo = document.getElementById(todo.id);
            $todolist.removeChild($todo.parentElement.parentElement);
        }else{
            active.push(todo)
        }
    }
    todos = active;
    todosChanged();
}

const toggleOneButton = (id) =>{
    filter = id;
    const $buttons = [$toditos,$active,$completed];
    for(const $button of $buttons) {
        if($button.id == id){
            $button.classList.add('chosen');
        }else{
            $button.classList.remove('chosen');
        }
    }
}

document.body.onload = () => {
    const storageTodos = localStorage.getItem('todos'); 
    if(storageTodos){
        todos = JSON.parse(storageTodos);
        for(const todo of todos){
            createTodoInDocument(todo.value,todo.id,todo.completed);
        }
    }

    todosChanged();
} 

$input.onkeyup = (e) =>{
    if(e.code == 'Enter'){
        createTodo(e.target.value);
        $input.value = '';
    }
}

const onCheckboxClick = (e) =>{
    for(const todo of todos){
        if(todo.id === e.target.id){
            todo.completed = !todo.completed;
            break;
        }
    }

    if(filter == 'activos'){
        active();
    }else if (filter == 'completed'){
        completed()
    }
    todosChanged();
}

const onXClick = (e) =>{
    const id = e.target.previousSibling.firstChild.id;
    const index = todos.findIndex((todo) => todo.id == id);
	todos.splice(index, 1);

	$todolist.removeChild(e.target.previousSibling.parentElement);

    todosChanged();
}

const createTodo = (text) =>{
    const id = createTodoInDocument(text);
    todos.push({
        id: id,
        value: text,
        completed: false,
    })
    todosChanged();
}

const createTodoInDocument = (text, todoId, checked) =>{
    const id = todoId !== undefined ? todoId : new Date().toISOString();
    const $todo = document.createElement('div');
    $todo.classList.add('todo');
    const $div = document.createElement('div');
    $div.classList.add('left'); 

    const $checkbox = document.createElement('input');
    $checkbox.type = 'checkbox';
    $checkbox.id = id;
    if(checked){
        $checkbox.checked = true
    }
    $checkbox.onclick = onCheckboxClick;
    $div.appendChild($checkbox)

    const $label = document.createElement('label');
    $label.setAttribute('for',id);
    $label.classList.add('text');
    $label.innerText = text;
    $div.appendChild($label)

    $todo.appendChild($div)

    const $x = document.createElement('i');
    $x.classList.add('fa-solid');
    $x.classList.add('fa-x');
    $x.onclick = onXClick;

    $todo.appendChild($x)
    $todolist.append($todo)
    return id;
} 

const todosChanged = () =>{
    if(todos.length !== 0){
        $footer.classList.remove('hidden');
    }else{
        $footer.classList.add('hidden');
    }
    const notCompleted = todos.filter((todo)=> !todo.completed)
    $remaining.innerText = `quedan ${notCompleted.length}`
    localStorage.setItem('todos',JSON.stringify(todos));
}