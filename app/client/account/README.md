# Client Account Module

This module handles user account management functionality, including:

- User listing with pagination
- Adding new users
- Editing existing users
- Deleting users
- Transferring ownership

## Loading State Implementation

The module implements comprehensive loading state indicators across all API calls:

1. **Global Loading Indicator**

   - Uses a context-based loading provider that shows a full-screen overlay during API calls
   - Implemented in `app/context/loading-context.tsx`

2. **API-Specific Loading States**

   - The users service (`app/services/users.service.ts`) manages loading state for all API calls
   - Uses a publish/subscribe pattern to notify components of loading state changes

3. **Action-Specific Loading Indicators**
   - Delete operation: Shows a spinner in the confirmation button during deletion
   - Edit/Add operations: Disables form controls during submission

## User Deletion Process with Loading Indicators

The updated user deletion process includes the following steps:

1. User clicks the delete button for a specific user
2. Confirmation modal appears asking for confirmation
3. When user confirms deletion:
   - The delete button shows "Deleting..." with a spinner
   - All buttons in the modal are disabled
   - The modal stays open during the API call
   - The API call is initiated and awaited
4. After the API responds (success or error):
   - The modal closes after a short delay
   - The user list updates to reflect the deletion
   - Any errors are logged to the console

### Key Components:

1. **ConfirmationModal Component**

   - Enhanced with an `isLoading` prop to show loading state
   - Disables buttons and prevents closing during loading
   - Shows a spinner in the confirm button while loading

2. **UsersSection Component**

   - Tracks deletion loading state with `isDeleting` state
   - Keeps modal open during the API call
   - Subscribes to loading state changes from the service

3. **UsersService**
   - Enhanced `deleteUser` method with proper loading state management
   - Notifies subscribers about loading changes
   - Includes comprehensive error handling

## Implementation Notes

- The user experience is smooth with visual feedback throughout the process
- Loading indicators appear immediately when the user confirms deletion
- All UI elements are properly disabled during loading to prevent multiple submissions
- Error handling ensures loading states are always cleaned up, even in failure cases

## Code Example

```tsx
// Deletion handler in UsersSection component
const handleDelete = async () => {
  if (userToDelete) {
    setIsDeleting(true);
    try {
      // Modal remains open with loading indicator during API call
      const response = await usersService.deleteUser(userToDelete);
      // Handle response...
    } catch (error) {
      // Handle error...
    } finally {
      // Clean up state after API call completes
      setIsDeleting(false);
      setDeleteModal(false);
    }
  }
};

// ConfirmationModal usage
<ConfirmationModal
  isOpen={deleteModal}
  onClose={cancelDelete}
  onConfirm={handleDelete}
  title="Delete User?"
  isLoading={isDeleting}
  // ... other props
/>;
```
