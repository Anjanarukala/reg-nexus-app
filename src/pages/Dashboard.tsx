import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/contexts/DataContext";
import { 
  Users, 
  BookOpen, 
  Layers, 
  UserPlus,
  TrendingUp,
  Calendar
} from "lucide-react";

const Dashboard = () => {
  const { courseTypes, courses, courseOfferings, registrations } = useData();

  const stats = [
    {
      title: "Course Types",
      value: courseTypes.length,
      icon: Layers,
      color: "bg-gradient-primary",
      textColor: "text-white",
    },
    {
      title: "Courses",
      value: courses.length,
      icon: BookOpen,
      color: "bg-gradient-secondary",
      textColor: "text-white",
    },
    {
      title: "Course Offerings",
      value: courseOfferings.length,
      icon: Users,
      color: "bg-accent",
      textColor: "text-accent-foreground",
    },
    {
      title: "Student Registrations",
      value: registrations.length,
      icon: UserPlus,
      color: "bg-muted",
      textColor: "text-muted-foreground",
    },
  ];

  const recentRegistrations = registrations
    .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
    .slice(0, 5);

  const popularCourseOfferings = courseOfferings.map(co => {
    const registrationCount = registrations.filter(r => r.courseOfferingId === co.id).length;
    return { ...co, registrationCount };
  }).sort((a, b) => b.registrationCount - a.registrationCount).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Welcome to EduManager
        </h1>
        <p className="text-lg text-muted-foreground">
          Your comprehensive student registration management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="shadow-elegant hover:shadow-primary transition-smooth">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentRegistrations.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No registrations yet
              </p>
            ) : (
              <div className="space-y-4">
                {recentRegistrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="flex items-center justify-between p-3 bg-accent rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {registration.studentName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {registration.studentEmail}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        {registration.courseTypeName} - {registration.courseName}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(registration.registrationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Course Offerings */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Popular Course Offerings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {popularCourseOfferings.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No course offerings yet
              </p>
            ) : (
              <div className="space-y-4">
                {popularCourseOfferings.map((offering) => (
                  <div
                    key={offering.id}
                    className="flex items-center justify-between p-3 bg-accent rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {offering.courseTypeName} - {offering.courseName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Created: {new Date(offering.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={offering.registrationCount > 0 ? "default" : "secondary"}
                      className="ml-2"
                    >
                      {offering.registrationCount} students
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;