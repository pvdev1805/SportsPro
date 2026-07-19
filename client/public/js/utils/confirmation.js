export const confirmDelete = async (productCode) => {
  const result = await window.Swal.fire({
    title: 'Delete Product',
    text: `Are you sure you want to delete ${productCode}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    focusCancel: true
  })

  return result.isConfirmed
}
