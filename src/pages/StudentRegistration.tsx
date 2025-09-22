import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Trash2, UserPlus, Filter, Mail, User, Calendar } from "lucide-react";

const StudentRegistration = () => {
  const { 
    courseTypes, 
    courseOfferings, 
    registrations,
    createRegistration, 
    deleteRegistration 
  } = useData();
  const { toast } = useToast();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    studentName: "", 
    studentEmail: "", 
    courseOfferingId: "" 
  });
  const [filterCourseType, setFilterCourseType] = useState<string>("all");
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>("all");

  const filteredOfferings = filterCourseType === "all" 
    ? courseOfferings 
    : courseOfferings.filter(co => co.courseTypeId === filterCourseType);

  const filteredRegistrations = selectedOfferingId === "all" 
    ? registrations 
    : registrations.filter(r => r.courseOfferingId === selectedOfferingId);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.studentEmail.trim() || !formData.courseOfferingId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.studentEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate registrations (same email for same offering)
    const existingRegistration = registrations.find(
      r => r.studentEmail.toLowerCase() === formData.studentEmail.toLowerCase() && 
           r.courseOfferingId === formData.courseOfferingId
    );

    if (existingRegistration) {
      toast({
        title: "Error",
        description: "This student is already registered for this course offering",
        variant: "destructive",
      });
      return;
    }

    createRegistration({
      studentName: formData.studentName.trim(),
      studentEmail: formData.studentEmail.toLowerCase().trim(),
      courseOfferingId: formData.courseOfferingId,
    });

    setFormData({ studentName: "", studentEmail: "", courseOfferingId: "" });
    setIsRegisterOpen(false);
    toast({
      title: "Success",
      description: "Student registered successfully",
    });
  };

  const handleDeleteRegistration = (registration: any) => {
    deleteRegistration(registration.id);
    toast({
      title: "Success",
      description: "Registration removed successfully",
    });
  };

  const availableOfferings = filteredOfferings.filter(offering => 
    offering.courseTypeId === filterCourseType || filterCourseType === "all"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-hero rounded-lg shadow-primary">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Student Registration</h1>
            <p className="text-muted-foreground">
              Register students for available course offerings
            </p>
          </div>
        </div>

        <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-hero hover:bg-primary/90 text-white shadow-primary">
              <Plus className="h-4 w-4 mr-2" />
              Register Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  value={formData.studentName}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                  placeholder="Enter student's full name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="studentEmail">Student Email</Label>
                <Input
                  id="studentEmail"
                  type="email"
                  value={formData.studentEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentEmail: e.target.value }))}
                  placeholder="student@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="courseOffering">Course Offering</Label>
                <Select 
                  value={formData.courseOfferingId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, courseOfferingId: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a course offering" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseOfferings.map((offering) => (
                      <SelectItem key={offering.id} value={offering.id}>
                        {offering.courseTypeName} - {offering.courseName}
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
                    setIsRegisterOpen(false);
                    setFormData({ studentName: "", studentEmail: "", courseOfferingId: "" });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Register Student</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Available Course Offerings Filter */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Available Course Offerings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Filter by Course Type:</Label>
              <Select value={filterCourseType} onValueChange={setFilterCourseType}>
                <SelectTrigger className="mt-1">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableOfferings.map((offering) => {
              const registrationCount = registrations.filter(r => r.courseOfferingId === offering.id).length;
              
              return (
                <Card key={offering.id} className="border-2 hover:border-primary transition-smooth">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">
                        {offering.courseTypeName} - {offering.courseName}
                      </h3>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{offering.courseTypeName}</Badge>
                        <Badge variant="secondary">
                          {registrationCount} students
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {availableOfferings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No course offerings available for the selected course type.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Registration List */}
      <Card className="shadow-elegant">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-secondary" />
              Student Registrations ({filteredRegistrations.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Label>Show registrations for:</Label>
              <Select value={selectedOfferingId} onValueChange={setSelectedOfferingId}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Course Offerings</SelectItem>
                  {courseOfferings.map((offering) => (
                    <SelectItem key={offering.id} value={offering.id}>
                      {offering.courseTypeName} - {offering.courseName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No registrations yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by registering students for available course offerings
              </p>
              <Button onClick={() => setIsRegisterOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Register Student
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRegistrations.map((registration) => (
                <Card key={registration.id} className="border hover:shadow-md transition-smooth">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold text-foreground">
                            {registration.studentName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {registration.studentEmail}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Registered: {new Date(registration.registrationDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge>
                          {registration.courseTypeName} - {registration.courseName}
                        </Badge>
                        <div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Registration</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove {registration.studentName}'s registration 
                                  for "{registration.courseTypeName} - {registration.courseName}"? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteRegistration(registration)}>
                                  Remove Registration
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentRegistration;