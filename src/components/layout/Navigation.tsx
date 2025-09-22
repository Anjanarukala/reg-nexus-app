import { NavLink } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  BookOpen, 
  Layers, 
  UserPlus,
  Home,
  GraduationCap
} from "lucide-react";

const Navigation = () => {
  const navItems = [
    { to: "/", label: "Dashboard", icon: Home },
    { to: "/course-types", label: "Course Types", icon: Layers },
    { to: "/courses", label: "Courses", icon: BookOpen },
    { to: "/course-offerings", label: "Course Offerings", icon: Users },
    { to: "/registrations", label: "Student Registration", icon: UserPlus },
  ];

  return (
    <Card className="p-6 bg-gradient-card shadow-elegant">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-hero rounded-lg shadow-primary">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">EduManager</h1>
          <p className="text-sm text-muted-foreground">Student Registration System</p>
        </div>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-smooth ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-primary"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </Card>
  );
};

export default Navigation;