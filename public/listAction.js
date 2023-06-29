const deleteBtn = document.querySelector('.card-button');

deleteBtn.addEventListener('click', () => {
  fetch('/delete', {
    method: 'DELETE',
    body: { id: 1 },
  })
})