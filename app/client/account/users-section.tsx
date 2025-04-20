"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  Trash2,
  ArrowLeftRight,
  Plus,
  X,
  AlertTriangle,
  Check,
  User,
  ChevronLeft,
  ChevronRight,
  Crown,
  ShieldCheck,
  Star,
  Building2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { useState, useEffect, useMemo, useRef } from "react";
import { getUser, getUsers } from "@/app/store/features/userSlice";
import ls from "localstorage-slim";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usersService, subscribeToLoading, type UserResponse } from "@/app/services/users.service";
import Loader from "@/components/ui/loader";
import { cookies } from "@/app/services/cookie.service";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface User {
  _id?: string;
  emailId?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  mobileNumber?: string;
  isOwner?: boolean;
  [key: string]: any;
}

interface FormData {
  firstName: string;
  lastName: string;
  emailId: string;
  mobileNumber: string;
  role: string;
  apiKey: string | null;
  adminEmail: string | null;
  country: string | null;
}

interface UserFormData {
  _id?: string;
  emailId: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  mobileNumber?: string;
  email?: string;
  apiKey?: string;
  adminEmail?: string;
  country?: string;
}

export function UsersSection() {
  const dispatch = useAppDispatch();
  const {
    users,
    loading: storeLoading,
    userdelerror,
    users_error,
    edituseralert,
    adduseralert,
    addusererror,
  } = useAppSelector((state) => state.user);

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Add state for transfer ownership modal
  const [transferModal, setTransferModal] = useState(false);
  const [transferToUser, setTransferToUser] = useState<User | null>(null);

  console.log(users, "here is the users");

  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [userIdToEdit, setUserIdToEdit] = useState<string | undefined>("");
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    emailId: "",
  });

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    emailId: "",
    mobileNumber: "",
    role: "",
    apiKey: cookies.get("apikey") || "",
    adminEmail: cookies.get("email") || "",
    country: cookies.get("country") || "",
  });

  const [deleteAnimation, setDeleteAnimation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const firstNameInputRef = useRef<HTMLInputElement>(null);

  // Calculate pagination details
  const totalPages = useMemo(() => Math.ceil((users?.length || 0) / usersPerPage), [users?.length, usersPerPage]);

  // Get current users for the page
  const currentUsers = useMemo(() => {
    if (!users) return [];
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    return users.slice(indexOfFirstUser, indexOfLastUser);
  }, [users, currentPage, usersPerPage]);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Navigation handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    // Subscribe to the global loading state for APIs
    const unsubscribeFromLoading = subscribeToLoading((isLoading: boolean) => {
      console.log("API Loading state:", isLoading);
    });

    // Subscribe to user service updates only for real-time updates
    const unsubscribeFromUsers = usersService.subscribe((data) => {
      // Only handle DELETE_USER_LOADING events here
      if (data.type === "DELETE_USER_LOADING" && data.data) {
        const { loading, email } = data.data;
        if (email === userToDelete) {
          setIsDeleting(loading);
        }
      }
    });

    // Initial data fetch
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        const response = await usersService.getUsers();
        if (isMounted) {
          // Only update state if component is still mounted
          if (response.success && response.data) {
            dispatch(getUsers(response.data));
          } else {
            dispatch(
              getUsers({
                workers: [],
                error: response?.error || "Failed to fetch users",
                ownerEmail: cookies.get("email") || "",
              })
            );
          }
        }
      } catch (error) {
        if (isMounted) {
          dispatch(
            getUsers({
              workers: [],
              error: error || "Error occurred while fetching users",
              ownerEmail: cookies.get("email") || "",
            })
          );
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
      unsubscribeFromUsers();
      unsubscribeFromLoading();
    };
  }, [dispatch, userToDelete]);

  // Reset to first page when users data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [users?.length]);

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      emailId: "",
      mobileNumber: "",
      role: "",
      apiKey: cookies.get("apikey") || "",
      adminEmail: cookies.get("email") || "",
      country: cookies.get("country") || "",
    });
    setFormErrors({
      firstName: "",
      emailId: "",
    });
    setIsEditMode(false);
    setUserIdToEdit("");
  };

  // Handle opening and closing the modal
  const handleAddToggle = () => {
    setAddModal(!addModal);
    if (!addModal) {
      resetForm();
    }
  };

  // Handle edit button click
  const handleEditClick = (user: User) => {
    setIsEditMode(true);
    setUserIdToEdit(user._id);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      emailId: user.emailId || "",
      mobileNumber: user.mobileNumber || user.mobilePhone || "",
      role: user.role || "",
      apiKey: cookies.get("apikey") || "",
      adminEmail: cookies.get("email") || "",
      country: cookies.get("country") || "",
    });
    setAddModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (formErrors[e.target.name as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { firstName: "", emailId: "" };

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
      isValid = false;
    }

    if (!formData.emailId.trim()) {
      errors.emailId = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.emailId)) {
        errors.emailId = "Invalid email format";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isEditMode, "here is the userData");
    if (validateForm()) {
      // Close the modal immediately
      setAddModal(false);

      // Set the loading state
      setIsAdding(true);

      try {
        // Extract form data
        const { emailId, ...restFormData } = formData;

        if (isEditMode) {
          // For updates, only include fields that have changed
          const originalUser = currentUsers.find((user) => user._id === userIdToEdit || user.emailId === emailId);
          if (originalUser) {
            // Create a payload that only includes changed fields but meets UserFormData interface requirements
            const changedFields: UserFormData = {
              emailId: emailId, // Always include emailId as it's required
              email: emailId, // Include email for API compatibility
              apiKey: cookies.get("apikey") || undefined, // Use undefined instead of null
              adminEmail: cookies.get("email") || undefined,
              role: formData.role || undefined, // Always include role in the payload
            };

            // Check each field for changes
            if (formData.firstName !== originalUser.firstName) {
              changedFields.firstName = formData.firstName || undefined;
            }

            if (formData.lastName !== originalUser.lastName) {
              changedFields.lastName = formData.lastName || undefined;
            }

            if (formData.mobileNumber !== (originalUser.mobileNumber || originalUser.mobilePhone)) {
              changedFields.mobileNumber = formData.mobileNumber || undefined;
            }

            // Add _id if available
            if (userIdToEdit) {
              changedFields._id = userIdToEdit;
            }

            console.log("Updating user with changed fields:", changedFields);
            await usersService.updateUser(changedFields);
          } else {
            // Fallback if original user not found
            console.log("Original user not found, updating with all fields");
            // Make sure we handle null values properly
            const updateData: UserFormData = {
              emailId,
              email: emailId,
              _id: userIdToEdit,
              firstName: formData.firstName || undefined,
              lastName: formData.lastName || undefined,
              role: formData.role || undefined,
              mobileNumber: formData.mobileNumber || undefined,
              apiKey: formData.apiKey || undefined,
              adminEmail: formData.adminEmail || undefined,
              country: formData.country || undefined,
            };

            await usersService.updateUser(updateData);
          }
        } else {
          // For adding new users, process all fields
          // Process the data to ensure API compatibility
          const processedData = Object.entries(restFormData).reduce((acc, [key, value]) => {
            acc[key] = value === null ? undefined : value;
            return acc;
          }, {} as Record<string, any>);

          const userData: UserFormData = {
            ...processedData,
            emailId,
            email: emailId, // Add email property to satisfy the interface
          };

          // Add new user
          console.log("Adding new user:", userData);
          await usersService.addUser(userData);
        }
      } catch (error) {
        console.error("Error adding/updating user:", error);
      } finally {
        // Clear the adding state when operation completes
        setIsAdding(false);
        // Reset the form
        resetForm();
      }
    }
  };

  const handleDeleteClick = (emailId: string) => {
    setUserToDelete(emailId);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    if (userToDelete) {
      // First close the modal immediately
      setDeleteModal(false);

      // Then set the deleting state to show the loader in the table row
      setIsDeleting(true);

      try {
        console.log("Deleting user:", userToDelete);

        // Make the API call and await the response
        const response = await usersService.deleteUser(userToDelete);

        if (!response.success) {
          console.error("Failed to delete user:", response.error);
        } else {
          console.log("User deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      } finally {
        // Clear the deleting state when operation completes
        setIsDeleting(false);
        setDeleteAnimation(false);
        setUserToDelete("");
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModal(false);
    setUserToDelete("");
  };

  const handleTransferOwnership = (currentOwner: string | null, newOwner: User) => {
    if (!currentOwner) return;
    setTransferToUser(newOwner);
    setTransferModal(true);
  };

  const confirmTransferOwnership = () => {
    const currentOwner = cookies.get("email");
    if (currentOwner && transferToUser?.emailId) {
      usersService.transferOwnership(currentOwner, transferToUser.emailId);
    }
    setTransferModal(false);
    setTransferToUser(null);
  };

  const cancelTransferOwnership = () => {
    setTransferModal(false);
    setTransferToUser(null);
  };

  const transitionConfig = {
    type: "spring",
    stiffness: 70,
    damping: 25,
    restDelta: 0.001,
    mass: 0.5,
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: 200 },
    show: { opacity: 1, x: 0 },
  };

  // Render pagination controls
  const renderPaginationControls = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-8">
        <div className="flex items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-full px-6 py-2 shadow-sm dark:shadow-gray-950/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="h-8 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white focus:text-gray-900 dark:focus:text-white border-none disabled:text-gray-400 dark:disabled:text-gray-600 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="mx-4 font-medium text-gray-900 dark:text-white">{currentPage}</div>

          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="h-8 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white focus:text-gray-900 dark:focus:text-white border-none disabled:text-gray-400 dark:disabled:text-gray-600 disabled:hover:bg-transparent"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  // Add an effect to handle cursor positioning when the modal opens
  useEffect(() => {
    if (addModal && firstNameInputRef.current) {
      // Longer delay to ensure the DOM is fully rendered and animations complete
      setTimeout(() => {
        const inputElement = firstNameInputRef.current;
        if (inputElement) {
          // First blur the element to remove any automatic focus
          inputElement.blur();

          // Then apply custom focus and cursor position
          inputElement.focus();
          const length = inputElement.value.length;
          inputElement.setSelectionRange(length, length);
        }
      }, 100); // Increased timeout for better reliability
    }
  }, [addModal]);

  // Function to handle click on the input field
  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // Prevent default selection behavior
    e.preventDefault();

    const inputElement = e.target as HTMLInputElement;
    // Move cursor to end of text
    const length = inputElement.value.length;
    inputElement.setSelectionRange(length, length);
  };

  return (
    <TooltipProvider delayDuration={2000}>
      <motion.div
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={transitionConfig}
        className="space-y-6"
      >
        {(adduseralert || userdelerror || edituseralert) && (
          <Alert className="mb-4">
            <AlertDescription>
              {adduseralert && "User added successfully"}
              {userdelerror && "User deleted successfully"}
              {edituseralert && "User updated successfully"}
            </AlertDescription>
          </Alert>
        )}

        {(users_error || addusererror) && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {typeof users_error === "string" ? users_error : "An error occurred"}
              {typeof addusererror === "string" ? addusererror : ""}
            </AlertDescription>
          </Alert>
        )}

        <motion.div
          initial={{ opacity: 0, x: 200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...transitionConfig, delay: 0.1 }}
          className="flex justify-between items-center"
        >
          <h2 className="text-2xl font-semibold tracking-tight">User management</h2>
          <Button onClick={handleAddToggle}>
            <Plus className="mr-2 h-4 w-4" /> Add user
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...transitionConfig, delay: 0.2 }}
          className={`rounded-md border relative ${storeLoading || isDeleting || isAdding ? "min-h-[300px]" : ""}`}
        >
          {/* Global loading overlay */}
          {storeLoading && !isDeleting && !isAdding && !deleteModal && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-950/50 flex items-center justify-center backdrop-blur-sm z-10">
              <div className="w-8 h-8">
                <Loader />
              </div>
            </div>
          )}

          {/* Deletion loading overlay */}
          {isDeleting && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-950/50 flex items-center justify-center backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10">
                  <Loader />
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Deleting user...</p>
              </div>
            </div>
          )}

          {/* Add user loading overlay */}
          {isAdding && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-950/50 flex items-center justify-center backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10">
                  <Loader />
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isEditMode ? "Updating user..." : "Adding user..."}
                </p>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <motion.tr
                key="header"
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...transitionConfig, delay: 0.3 }}
                className="bg-gray-50 dark:bg-gray-800"
              >
                <TableHead className="w-fit font-semibold text-gray-700 dark:text-gray-300">User</TableHead>
                <TableHead className="w-24 font-semibold text-gray-700 dark:text-gray-300">Role</TableHead>
                <TableHead className="w-auto font-semibold text-gray-700 dark:text-gray-300">Email</TableHead>
                <TableHead className="w-32 font-semibold text-gray-700 dark:text-gray-300">Mobile</TableHead>
                <TableHead className="w-28 text-right font-semibold text-gray-700 dark:text-gray-300">Actions</TableHead>
              </motion.tr>
            </TableHeader>
            <motion.tbody key="tbody" variants={container} initial="hidden" animate="show">
              {currentUsers.map((user, index) => (
                <motion.tr
                  key={user._id || `${user.email}-${index}`}
                  variants={item}
                  transition={transitionConfig}
                  className="group border-b transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                >
                  <TableCell className="py-4 min-w-[200px] max-w-[300px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">
                          {user.firstName} {user.lastName}
                        </div>
                        {user.isOwner && (
                          <Badge variant="secondary" className="mt-1">
                            Owner
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 w-24">
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 w-auto text-gray-600 dark:text-gray-400 truncate">{user.emailId}</TableCell>
                  <TableCell className="py-4 w-32 text-gray-600 dark:text-gray-400">
                    {user.mobileNumber || user.mobilePhone || "—"}
                  </TableCell>
                  <TableCell className="text-right w-28">
                    <motion.div
                      key={`actions-${user._id || index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="flex justify-end gap-2"
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-11 w-11 p-0 hover:bg-transparent hover:scale-125 hover:animate-pulse hover:text-blue-500 transition-all duration-300"
                            onClick={() => handleEditClick(user)}
                          >
                            <Pencil className="h-9 w-9" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit user details</p>
                        </TooltipContent>
                      </Tooltip>
                      {!user.isOwner && (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-11 w-11 p-0 hover:bg-transparent hover:scale-125 hover:animate-bounce hover:text-red-500 transition-all duration-300"
                                onClick={() => handleDeleteClick(user.emailId || "")}
                              >
                                <Trash2 className="h-9 w-9" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete user</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                className={`h-11 w-11 p-0 transition-all duration-300 ${
                                  user.role === "Admin"
                                    ? "hover:bg-transparent hover:scale-125 hover:animate-spin hover:text-indigo-500"
                                    : "opacity-50 cursor-not-allowed"
                                }`}
                                onClick={() => {
                                  if (user.role === "Admin") {
                                    const currentOwner = cookies.get("email");
                                    if (currentOwner && typeof currentOwner === "string") {
                                      handleTransferOwnership(currentOwner, user);
                                    }
                                  }
                                }}
                                disabled={user.role !== "Admin"}
                              >
                                <ArrowLeftRight className="h-9 w-9" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {user.role === "Admin"
                                  ? "Transfer ownership to this user"
                                  : "Only Admin users can receive ownership"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </>
                      )}
                    </motion.div>
                  </TableCell>
                </motion.tr>
              ))}

              {/* Empty state when no users are available or for current page */}
              {(!currentUsers || currentUsers.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <User className="h-8 w-8 mb-2 opacity-30" />
                      <p>No users found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </motion.tbody>
          </Table>
        </motion.div>

        {/* Pagination Controls */}
        {renderPaginationControls()}

        <Dialog open={addModal} onOpenChange={handleAddToggle}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={formErrors.firstName ? "border-red-500" : ""}
                    ref={firstNameInputRef}
                    onClick={handleInputClick}
                    // Prevent auto-selection when focused
                    onFocus={(e) => {
                      // Use requestAnimationFrame for better timing
                      requestAnimationFrame(() => {
                        const length = e.target.value.length;
                        e.target.setSelectionRange(length, length);
                      });
                    }}
                    autoFocus={false}
                  />
                  {formErrors.firstName && <p className="text-sm text-red-500">{formErrors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="emailId"
                  type="email"
                  value={formData.emailId}
                  onChange={handleChange}
                  className={formErrors.emailId ? "border-red-500" : ""}
                  disabled={isEditMode} // Email shouldn't be editable in edit mode
                />
                {formErrors.emailId && <p className="text-sm text-red-500">{formErrors.emailId}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin (Complete access & manage users)</SelectItem>
                    <SelectItem value="Developer"> Developer (Access to API key & token)</SelectItem>
                    <SelectItem value="User"> User (Access to only his own documents)</SelectItem>
                    <SelectItem value="Account"> Account (Access to accounts section)</SelectItem>
                    <SelectItem value="Manager"> Manager (Access to documents of all users)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleAddToggle}>
                  Cancel
                </Button>
                <Button type="submit">{isEditMode ? "Update user" : "Add user"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <ConfirmationModal
          isOpen={deleteModal}
          onClose={cancelDelete}
          onConfirm={handleDelete}
          title="Delete user?"
          description="This action will permanently remove the user's account and all associated data. This cannot be undone."
          cancelText="Keep user"
          confirmText="Delete user"
          variant="delete"
          isLoading={false}
          itemDetail={{
            label: "Email",
            value: userToDelete,
          }}
        />

        {/* Add Transfer Ownership Modal */}
        <ConfirmationModal
          isOpen={transferModal}
          onClose={cancelTransferOwnership}
          onConfirm={confirmTransferOwnership}
          title="Transfer ownership?"
          description="This action will transfer ownership of the account to the selected user. You will be logged out after this action. This cannot be undone."
          cancelText="Cancel"
          confirmText="Transfer Ownership"
          variant="warning"
          isLoading={false}
          itemDetail={{
            label: "Transfer to",
            value: `${transferToUser?.emailId}`,
          }}
        />
      </motion.div>
    </TooltipProvider>
  );
}
