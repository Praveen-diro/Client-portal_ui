"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, ArrowLeftRight, Plus, X, AlertTriangle, Check, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { useState, useEffect, useMemo } from "react";
import { getUser, getUsers } from "@/app/store/features/userSlice";
import ls from "localstorage-slim";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usersService, type UserResponse } from "@/app/services/users.service";
import Loader from "@/components/ui/loader";
import { cookies } from "@/app/services/cookie.service";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

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

export function UsersSection() {
  const dispatch = useAppDispatch();
  const { users, loading, userdelerror, users_error, edituseralert, adduseralert, addusererror } = useAppSelector(
    (state) => state.user
  );

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

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
    const fetchUsers = async () => {
      const response = await usersService.getUsers();

      if (response.success && response.data) {
        console.log(response, "here is the response");
        dispatch(getUsers(response.data));
      }
    };

    fetchUsers();

    // Subscribe to user service updates
    const unsubscribe = usersService.subscribe((data) => {
      if (data.type === "GET_USERS" && data.data) {
        dispatch(getUsers(data.data));
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [dispatch]);

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
      mobileNumber: user.mobileNumber || "",
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
    if (validateForm()) {
      const { emailId, ...rest } = formData;
      const userData = {
        ...rest,
        emailId: emailId,
      };

      if (isEditMode && userIdToEdit) {
        // Update existing user
        await usersService.updateUser({
          ...userData,
          email: emailId, // Service expects 'email' property
          _id: userIdToEdit,
        });
      } else {
        // Add new user
        await usersService.addUser(userData);
      }
      handleAddToggle();
    }
  };

  const handleDeleteClick = (emailId: string) => {
    setUserToDelete(emailId);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    if (userToDelete) {
      setDeleteAnimation(true);

      setTimeout(() => {
        usersService.deleteUser(userToDelete);
        setDeleteModal(false);
        setDeleteAnimation(false);
      }, 1000);
    }
  };

  const cancelDelete = () => {
    setDeleteModal(false);
    setUserToDelete("");
  };

  const handleTransferOwnership = (currentOwner: string | null, newOwner: string) => {
    if (!currentOwner) return;
    if (window.confirm("Are you sure you want to transfer ownership? You will be logged out after this action.")) {
      usersService.transferOwnership(currentOwner, newOwner);
    }
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
        <div className="flex items-center bg-gray-900 dark:bg-gray-900 text-white dark:text-white rounded-full px-6 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="h-8 text-white hover:bg-gray-800 hover:text-white focus:text-white border-none"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="mx-4 font-medium">{currentPage}</div>

          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="h-8 text-white hover:bg-gray-800 hover:text-white focus:text-white border-none"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  return (
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
        <h2 className="text-2xl font-semibold tracking-tight">User Management</h2>
        <Button onClick={handleAddToggle}>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...transitionConfig, delay: 0.2 }}
        className={`rounded-md border relative ${loading ? "min-h-[300px]" : ""}`}
      >
        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-950/50 flex items-center justify-center backdrop-blur-sm z-10">
            <div className="w-8 h-8">
              <Loader />
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
                <TableCell className="py-4 w-32 text-gray-600 dark:text-gray-400">{user.mobileNumber || "—"}</TableCell>
                <TableCell className="text-right w-28">
                  <motion.div
                    key={`actions-${user._id || index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-end gap-1"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(user)}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Pencil className="h-5 w-5" />
                    </Button>
                    {!user.isOwner && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(user.emailId || "")}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const currentOwner = cookies.get("email");
                            if (currentOwner && typeof currentOwner === "string") {
                              handleTransferOwnership(currentOwner, user.emailId);
                            }
                          }}
                          className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <ArrowLeftRight className="h-5 w-5" />
                        </Button>
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
              <Button type="submit">{isEditMode ? "Update User" : "Add User"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        isOpen={deleteModal}
        onClose={cancelDelete}
        onConfirm={handleDelete}
        title="Delete User?"
        description="This action will permanently remove the user's account and all associated data. This cannot be undone."
        cancelText="Keep User"
        confirmText="Delete User"
        variant="delete"
        itemDetail={{
          label: "Email",
          value: userToDelete,
        }}
      />
    </motion.div>
  );
}
