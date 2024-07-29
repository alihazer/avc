async function confirmDelete(message){
    const result = await Swal.fire({
        title: `${message}`,
        icon: 'warning',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Delete`,
        denyButtonText: `Don't delete`,
    })
    return result.isConfirmed;
}

export default confirmDelete;