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
import { Plus, Edit, Trash2, Layers } from "lucide-react";
import { CourseType } from "@/types";

const CourseTypes = () => {
  const { courseTypes, createCourseType, updateCourseType, deleteCourseType, courseOfferings } = useData();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCourseType, setEditingCourseType] = useState<CourseType | null>(null);
  const [formData, setFormData] = useState({ name: "" });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Course type name is required",
        variant: "destructive",
      });
      return;
    }

    createCourseType({ name: formData.name.trim() });
    setFormData({ name: "" });
    setIsCreateOpen(false);
    toast({
      title: "Success",
      description: "Course type created successfully",
    });
  };

  const handleEdit = (courseType: CourseType) => {
    setEditingCourseType(courseType);
    setFormData({ name: courseType.name });
    setIsEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourseType || !formData.name.trim()) {
      toast({
        title: "Error",
        description: "Course type name is required",
        variant: "destructive",
      });
      return;
    }

    updateCourseType(editingCourseType.id, { name: formData.name.trim() });
    setFormData({ name: "" });
    setIsEditOpen(false);
    setEditingCourseType(null);
    toast({
      title: "Success",
      description: "Course type updated successfully",
    });
  };

  const handleDelete = (courseType: CourseType) => {
    const relatedOfferings = courseOfferings.filter(co => co.courseTypeId === courseType.id);
    
    if (relatedOfferings.length > 0) {
      toast({
        title: "Cannot delete",
        description: `This course type has ${relatedOfferings.length} related course offering(s). Please delete them first.`,
        variant: "destructive",
      });
      return;
    }

    deleteCourseType(courseType.id);
    toast({
      title: "Success",
      description: "Course type deleted successfully",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-primary rounded-lg shadow-primary">
            <Layers className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Course Types</h1>
            <p className="text-muted-foreground">
              Manage course type categories (Individual, Group, Special, etc.)
            </p>
          </div>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:bg-primary/90 text-white shadow-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Course Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Course Type</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="name">Course Type Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  placeholder="e.g., Individual, Group, Special"
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
                <Button type="submit">Create Course Type</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Course Types List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseTypes.map((courseType) => {
          const offeringCount = courseOfferings.filter(co => co.courseTypeId === courseType.id).length;
          
          return (
            <Card key={courseType.id} className="shadow-elegant hover:shadow-primary transition-smooth">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{courseType.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(courseType.createdAt).toLocaleDateString()}
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
                    onClick={() => handleEdit(courseType)}
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
                          This action cannot be undone. This will permanently delete the course type
                          "{courseType.name}" and remove any associated course offerings.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(courseType)}>
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

      {courseTypes.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No course types yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first course type
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Course Type
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course Type</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Course Type Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="e.g., Individual, Group, Special"
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
                  setEditingCourseType(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Update Course Type</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseTypes;