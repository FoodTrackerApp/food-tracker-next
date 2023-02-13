/**
 * @description : This function is used to handle text input
 * @param e 
 * @param name : string
 * @param setForm 
 */
const textHandler = (e, name : string, setForm) => {
    let value = e.target.value;
    
    if(name == "count") {
        value = parseInt(value);
    }

    setForm(prevState => ({
        ...prevState,
        [name]: value
    }))
}

export default textHandler;