import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { Course } from "@/types";

const Courses = () => {
  const { courses, createCourse, updateCourse, deleteCourse, courseOfferings } = useData();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({ name: "" });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Course name is required",
        variant: "destructive",
      });
      return;
    }

    createCourse({ name: formData.name.trim() });
    setFormData({ name: "" });
    setIsCreateOpen(false);
    toast({
      title: "Success",
      description: "Course created successfully",
    });
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({ name: course.name });
    setIsEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !formData.name.trim()) {
      toast({
        title: "Error",
        description: "Course name is required",
        variant: "destructive",
      });
      return;
    }

    updateCourse(editingCourse.id, { name: formData.name.trim() });
    setFormData({ name: "" });
    setIsEditOpen(false);
    setEditingCourse(null);
    toast({
      title: "Success",
      description: "Course updated successfully",
    });
  };

  const handleDelete = (course: Course) => {
    const relatedOfferings = courseOfferings.filter(co => co.courseId === course.id);
    
    if (relatedOfferings.length > 0) {
      toast({
        title: "Cannot delete",
        description: `This course has ${relatedOfferings.length} related course offering(s). Please delete them first.`,
        variant: "destructive",
      });
      return;
    }

    deleteCourse(course.id);
    toast({
      title: "Success",
      description: "Course deleted successfully",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-secondary rounded-lg shadow-secondary">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Courses</h1>
            <p className="text-muted-foreground">
              Manage course subjects (English, Hindi, Mathematics, etc.)
            </p>
          </div>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-secondary hover:bg-secondary/90 text-white shadow-secondary">
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  placeholder="e.g., English, Hindi, Mathematics"
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setFormData({ name: "" });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Course</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const offeringCount = courseOfferings.filter(co => co.courseId === course.id).length;
          
          return (
            <Card key={course.id} className="shadow-elegant hover:shadow-secondary transition-smooth">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(course.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {offeringCount} offerings
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(course)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the course
                          "{course.name}" and remove any associated course offerings.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(course)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {courses.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No courses yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first course
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Course Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="e.g., English, Hindi, Mathematics"
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditOpen(false);
                  setFormData({ name: "" });
                  setEditingCourse(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Update Course</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Courses;