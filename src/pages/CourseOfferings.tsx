import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Plus, Edit, Trash2, Users, Filter } from "lucide-react";
import { CourseOffering } from "@/types";

const CourseOfferings = () => {
  const { 
    courseTypes, 
    courses, 
    courseOfferings, 
    registrations,
    createCourseOffering, 
    updateCourseOffering, 
    deleteCourseOffering 
  } = useData();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCourseOffering, setEditingCourseOffering] = useState<CourseOffering | null>(null);
  const [formData, setFormData] = useState({ courseId: "", courseTypeId: "" });
  const [filterCourseType, setFilterCourseType] = useState<string>("all");

  const filteredOfferings = filterCourseType === "all" 
    ? courseOfferings 
    : courseOfferings.filter(co => co.courseTypeId === filterCourseType);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseId || !formData.courseTypeId) {
      toast({
        title: "Error",
        description: "Please select both course and course type",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate offerings
    const existingOffering = courseOfferings.find(
      co => co.courseId === formData.courseId && co.courseTypeId === formData.courseTypeId
    );

    if (existingOffering) {
      toast({
        title: "Error",
        description: "This course offering already exists",
        variant: "destructive",
      });
      return;
    }

    createCourseOffering({ 
      courseId: formData.courseId, 
      courseTypeId: formData.courseTypeId 
    });
    setFormData({ courseId: "", courseTypeId: "" });
    setIsCreateOpen(false);
    toast({
      title: "Success",
      description: "Course offering created successfully",
    });
  };

  const handleEdit = (courseOffering: CourseOffering) => {
    setEditingCourseOffering(courseOffering);
    setFormData({ 
      courseId: courseOffering.courseId, 
      courseTypeId: courseOffering.courseTypeId 
    });
    setIsEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourseOffering || !formData.courseId || !formData.courseTypeId) {
      toast({
        title: "Error",
        description: "Please select both course and course type",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate offerings (excluding current one)
    const existingOffering = courseOfferings.find(
      co => co.id !== editingCourseOffering.id &&
           co.courseId === formData.courseId && 
           co.courseTypeId === formData.courseTypeId
    );

    if (existingOffering) {
      toast({
        title: "Error",
        description: "This course offering already exists",
        variant: "destructive",
      });
      return;
    }

    updateCourseOffering(editingCourseOffering.id, { 
      courseId: formData.courseId, 
      courseTypeId: formData.courseTypeId 
    });
    setFormData({ courseId: "", courseTypeId: "" });
    setIsEditOpen(false);
    setEditingCourseOffering(null);
    toast({
      title: "Success",
      description: "Course offering updated successfully",
    });
  };

  const handleDelete = (courseOffering: CourseOffering) => {
    const relatedRegistrations = registrations.filter(r => r.courseOfferingId === courseOffering.id);
    
    if (relatedRegistrations.length > 0) {
      toast({
        title: "Cannot delete",
        description: `This course offering has ${relatedRegistrations.length} student registration(s). Please remove them first.`,
        variant: "destructive",
      });
      return;
    }

    deleteCourseOffering(courseOffering.id);
    toast({
      title: "Success",
      description: "Course offering deleted successfully",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent rounded-lg">
            <Users className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Course Offerings</h1>
            <p className="text-muted-foreground">
              Manage course and course type combinations
            </p>
          </div>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Course Offering
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Course Offering</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="course">Course</Label>
                <Select value={formData.courseId} onValueChange={(value) => setFormData(prev => ({ ...prev, courseId: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="courseType">Course Type</Label>
                <Select value={formData.courseTypeId} onValueChange={(value) => setFormData(prev => ({ ...prev, courseTypeId: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a course type" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseTypes.map((courseType) => (
                      <SelectItem key={courseType.id} value={courseType.id}>
                        {courseType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setFormData({ courseId: "", courseTypeId: "" });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Course Offering</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Label>Filter by Course Type:</Label>
          </div>
          <Select value={filterCourseType} onValueChange={setFilterCourseType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Course Types</SelectItem>
              {courseTypes.map((courseType) => (
                <SelectItem key={courseType.id} value={courseType.id}>
                  {courseType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Course Offerings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOfferings.map((courseOffering) => {
          const registrationCount = registrations.filter(r => r.courseOfferingId === courseOffering.id).length;
          
          return (
            <Card key={courseOffering.id} className="shadow-elegant hover:shadow-primary transition-smooth">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {courseOffering.courseTypeName} - {courseOffering.courseName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(courseOffering.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Badge variant="outline">{courseOffering.courseTypeName}</Badge>
                    <Badge variant="secondary" className="block text-center">
                      {registrationCount} students
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(courseOffering)}
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
                          This action cannot be undone. This will permanently delete the course offering
                          "{courseOffering.courseTypeName} - {courseOffering.courseName}" and all student registrations.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(courseOffering)}>
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

      {filteredOfferings.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {filterCourseType === "all" ? "No course offerings yet" : "No course offerings for this type"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {filterCourseType === "all" 
                ? "Get started by creating your first course offering" 
                : "Try selecting a different course type or create a new offering"
              }
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Course Offering
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course Offering</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label htmlFor="edit-course">Course</Label>
              <Select value={formData.courseId} onValueChange={(value) => setFormData(prev => ({ ...prev, courseId: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-courseType">Course Type</Label>
              <Select value={formData.courseTypeId} onValueChange={(value) => setFormData(prev => ({ ...prev, courseTypeId: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a course type" />
                </SelectTrigger>
                <SelectContent>
                  {courseTypes.map((courseType) => (
                    <SelectItem key={courseType.id} value={courseType.id}>
                      {courseType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditOpen(false);
                  setFormData({ courseId: "", courseTypeId: "" });
                  setEditingCourseOffering(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Update Course Offering</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseOfferings;