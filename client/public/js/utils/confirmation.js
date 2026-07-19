export const confirmDelete = async ({ itemLabel, itemName = '' }) => {
  const result = await window.Swal.fire({
    title: `Delete ${itemLabel}`,
    text: `Are you sure you want to delete ${itemName}?`,
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
