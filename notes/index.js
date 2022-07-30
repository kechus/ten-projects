const addNoteToDOM = (note) =>{
    const $container = document.createElement("div");
	$container.classList.add("container");

    const id = note ? note.id : new Date().toISOString()
	const editId = id + "-e";
	const closeId = id + "-x";
    const text = note ? note.text : ''
    const markup = note ? parseMarkup(note.text) : ''

	$container.innerHTML = `
    <div class="note-header">
            <div class="left">
                <i class="fa-solid fa-pen-to-square" id=${editId}></i>
            </div>
            <div class="right">
                <i class="fa-solid fa-x" id=${closeId}> </i>
            </div>
    </div>
    <textarea name="area" id="${id}" class="area hidden">${text}</textarea>
    <div class='markup'>${markup}</div>
    `;
	document.body.append($container);
	const $textarea = document.getElementById(id);
	$textarea.oninput = handleInput;

	const $close = document.getElementById(closeId);
	$close.onclick = handleClose;

    const $edit = document.getElementById(editId);
	$edit.onclick = handleEdit;
    return id;
}

const findNotesInLocalStorage = () => {
	const storedNotesJSON = localStorage.getItem("notes");
	if (!storedNotesJSON) {
		return [];
	}
    const storedNotes = JSON.parse(storedNotesJSON);
    for(const note of storedNotes){
        addNoteToDOM(note)
    }
	return storedNotes;
};

const handleInput = (e) => {
	const id = e.target.id;

	for (const note of notes) {
		if (note.id == id) {
            note.text = e.target.value;
            break
        }
	}
    saveNotes()
};

const handleClose = (e) => {
	const node = e.target.parentNode.parentNode.parentNode;
	//div.right div.note-header div.container
	document.body.removeChild(node);
	
    const [realId, _] = e.target.id.split("-");
	const index = notes.findIndex((note) => note.id == realId);
	notes.splice(index, 1);
    saveNotes()
};

const handleEdit = (e) =>{
    const $area = e.target.parentNode.parentNode.nextElementSibling
    const $markup = $area.nextElementSibling
    $area.classList.toggle('hidden')
    $markup.classList.toggle('hidden')
    if($area.classList.contains('hidden')){
        const parsed = parseMarkup($area.value)
        $area.nextElementSibling.innerHTML = parsed
    }else{
        $area.nextElementSibling.innerHTML = ''
    }
}

const parseMarkup = (text) =>{
    const regexes = [
        {
            regex : /(\r\n|\r|\n)/ig,
            replace: '</br>'
        },
        {
            regex : /[^\S\r\n]/g,
            replace: '&nbsp;'
        },        
    ]
    for(const r of regexes){
        text = text.replaceAll(r.regex,r.replace)
    }
    return text
}

const $button = document.querySelector("#add");
const notes = findNotesInLocalStorage();

const addNote = () => {
    const id = addNoteToDOM()

	notes.push({
		id: id,
		text: "",
	});
    saveNotes()
};

const saveNotes = () =>{
    localStorage.setItem("notes", JSON.stringify(notes));
}