const form = document.querySelector('form');
if (!form) return;
form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
    const form = event.currentTarget;
    fetch(form.action,{
        method: 'post',
        body: new FormData(form)
    });
    event.preventDefault()

}