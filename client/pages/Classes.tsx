import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Badge } from "../components/ui/badge";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Users,
  FileText,
  CheckSquare,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";

const colorOptions = [
  { name: "Blue", value: "#3b82f6", bg: "bg-blue-500" },
  { name: "Green", value: "#10b981", bg: "bg-emerald-500" },
  { name: "Purple", value: "#8b5cf6", bg: "bg-violet-500" },
  { name: "Orange", value: "#f59e0b", bg: "bg-amber-500" },
  { name: "Red", value: "#ef4444", bg: "bg-red-500" },
  { name: "Pink", value: "#ec4899", bg: "bg-pink-500" },
  { name: "Indigo", value: "#6366f1", bg: "bg-indigo-500" },
  { name: "Teal", value: "#14b8a6", bg: "bg-teal-500" },
];

export default function Classes() {
  const { classes, tasks, notes, events, addClass, updateClass, removeClass } =
    useData();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingClass, setEditingClass] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    color: colorOptions[0].value,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingClass) {
      updateClass(editingClass, { name: formData.name, color: formData.color });
      setEditingClass(null);
    } else {
      addClass({ name: formData.name, color: formData.color });
    }

    setFormData({ name: "", color: colorOptions[0].value });
    setShowAddDialog(false);
  };

  const handleEdit = (classItem: any) => {
    setFormData({ name: classItem.name, color: classItem.color });
    setEditingClass(classItem.id);
    setShowAddDialog(true);
  };

  const handleDelete = (classId: string) => {
    removeClass(classId);
  };

  const getClassStats = (classId: string) => {
    const classTasks = tasks.filter((task) => task.classID === classId);
    const classNotes = notes.filter((note) => note.classID === classId);
    const classEvents = events.filter((event) => event.classID === classId);
    const completedTasks = classTasks.filter(
      (task) => task.status === "completed",
    ).length;

    return {
      totalTasks: classTasks.length,
      completedTasks,
      totalNotes: classNotes.length,
      totalEvents: classEvents.length,
    };
  };

  const resetForm = () => {
    setFormData({ name: "", color: colorOptions[0].value });
    setEditingClass(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Classes</h1>
          <p className="text-muted-foreground">
            Manage your classes and subjects. Organize your academic work by
            class.
          </p>
        </div>
        <Dialog
          open={showAddDialog}
          onOpenChange={(open) => {
            setShowAddDialog(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingClass ? "Edit Class" : "Add New Class"}
                </DialogTitle>
                <DialogDescription>
                  {editingClass
                    ? "Update your class information."
                    : "Create a new class to organize your academic work."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Class Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Mathematics, History, Biology"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, color: color.value })
                        }
                        className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                          formData.color === color.value
                            ? "border-foreground ring-2 ring-ring"
                            : "border-border"
                        } ${color.bg}`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingClass ? "Update Class" : "Create Class"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No classes yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first class to start organizing your academic work.
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Class
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((classItem) => {
            const stats = getClassStats(classItem.id);
            const completionPercentage =
              stats.totalTasks > 0
                ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
                : 0;

            return (
              <Card
                key={classItem.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: classItem.color }}
                      />
                      <div>
                        <CardTitle className="text-lg">
                          {classItem.name}
                        </CardTitle>
                        <CardDescription>
                          Created {format(classItem.createdAt, "MMM d, yyyy")}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(classItem)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Class</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{classItem.name}
                              "? This action cannot be undone.
                              {(stats.totalTasks > 0 ||
                                stats.totalNotes > 0 ||
                                stats.totalEvents > 0) && (
                                <span className="block mt-2 text-destructive">
                                  Warning: This will also remove{" "}
                                  {stats.totalTasks} tasks, {stats.totalNotes} notes
                                  {stats.totalEvents > 0 && `, and ${stats.totalEvents} events`} associated with this
                                  class.
                                </span>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(classItem.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <CheckSquare className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {stats.totalTasks}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Tasks</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {stats.totalNotes}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Notes</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {stats.totalEvents}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Events</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-sm font-medium">
                          {completionPercentage}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Complete</p>
                    </div>
                  </div>

                  {stats.totalTasks > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {stats.completedTasks}/{stats.totalTasks}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${completionPercentage}%`,
                            backgroundColor: classItem.color,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
