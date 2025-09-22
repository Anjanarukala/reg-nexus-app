import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CourseType, 
  Course, 
  CourseOffering, 
  Registration,
  CreateCourseTypeData,
  CreateCourseData,
  CreateCourseOfferingData,
  CreateRegistrationData
} from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface DataContextType {
  // Course Types
  courseTypes: CourseType[];
  createCourseType: (data: CreateCourseTypeData) => void;
  updateCourseType: (id: string, data: CreateCourseTypeData) => void;
  deleteCourseType: (id: string) => void;

  // Courses
  courses: Course[];
  createCourse: (data: CreateCourseData) => void;
  updateCourse: (id: string, data: CreateCourseData) => void;
  deleteCourse: (id: string) => void;

  // Course Offerings
  courseOfferings: CourseOffering[];
  createCourseOffering: (data: CreateCourseOfferingData) => void;
  updateCourseOffering: (id: string, data: CreateCourseOfferingData) => void;
  deleteCourseOffering: (id: string) => void;

  // Registrations
  registrations: Registration[];
  createRegistration: (data: CreateRegistrationData) => void;
  deleteRegistration: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [courseTypes, setCourseTypes] = useLocalStorage<CourseType[]>('courseTypes', []);
  const [courses, setCourses] = useLocalStorage<Course[]>('courses', []);
  const [courseOfferings, setCourseOfferings] = useLocalStorage<CourseOffering[]>('courseOfferings', []);
  const [registrations, setRegistrations] = useLocalStorage<Registration[]>('registrations', []);

  // Initialize with sample data if empty
  useEffect(() => {
    if (courseTypes.length === 0) {
      const sampleCourseTypes: CourseType[] = [
        { id: '1', name: 'Individual', createdAt: new Date() },
        { id: '2', name: 'Group', createdAt: new Date() },
        { id: '3', name: 'Special', createdAt: new Date() },
      ];
      setCourseTypes(sampleCourseTypes);
    }

    if (courses.length === 0) {
      const sampleCourses: Course[] = [
        { id: '1', name: 'English', createdAt: new Date() },
        { id: '2', name: 'Hindi', createdAt: new Date() },
        { id: '3', name: 'Urdu', createdAt: new Date() },
        { id: '4', name: 'Mathematics', createdAt: new Date() },
      ];
      setCourses(sampleCourses);
    }
  }, [courseTypes.length, courses.length, setCourseTypes, setCourses]);

  // Course Types functions
  const createCourseType = (data: CreateCourseTypeData) => {
    const newCourseType: CourseType = {
      id: Date.now().toString(),
      name: data.name,
      createdAt: new Date(),
    };
    setCourseTypes(prev => [...prev, newCourseType]);
  };

  const updateCourseType = (id: string, data: CreateCourseTypeData) => {
    setCourseTypes(prev =>
      prev.map(ct => ct.id === id ? { ...ct, name: data.name } : ct)
    );
  };

  const deleteCourseType = (id: string) => {
    setCourseTypes(prev => prev.filter(ct => ct.id !== id));
    // Also remove related course offerings
    setCourseOfferings(prev => prev.filter(co => co.courseTypeId !== id));
  };

  // Courses functions
  const createCourse = (data: CreateCourseData) => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: data.name,
      createdAt: new Date(),
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const updateCourse = (id: string, data: CreateCourseData) => {
    setCourses(prev =>
      prev.map(c => c.id === id ? { ...c, name: data.name } : c)
    );
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    // Also remove related course offerings
    setCourseOfferings(prev => prev.filter(co => co.courseId !== id));
  };

  // Course Offerings functions
  const createCourseOffering = (data: CreateCourseOfferingData) => {
    const course = courses.find(c => c.id === data.courseId);
    const courseType = courseTypes.find(ct => ct.id === data.courseTypeId);
    
    if (course && courseType) {
      const newCourseOffering: CourseOffering = {
        id: Date.now().toString(),
        courseId: data.courseId,
        courseTypeId: data.courseTypeId,
        courseName: course.name,
        courseTypeName: courseType.name,
        createdAt: new Date(),
      };
      setCourseOfferings(prev => [...prev, newCourseOffering]);
    }
  };

  const updateCourseOffering = (id: string, data: CreateCourseOfferingData) => {
    const course = courses.find(c => c.id === data.courseId);
    const courseType = courseTypes.find(ct => ct.id === data.courseTypeId);
    
    if (course && courseType) {
      setCourseOfferings(prev =>
        prev.map(co => co.id === id ? {
          ...co,
          courseId: data.courseId,
          courseTypeId: data.courseTypeId,
          courseName: course.name,
          courseTypeName: courseType.name,
        } : co)
      );
    }
  };

  const deleteCourseOffering = (id: string) => {
    setCourseOfferings(prev => prev.filter(co => co.id !== id));
    // Also remove related registrations
    setRegistrations(prev => prev.filter(r => r.courseOfferingId !== id));
  };

  // Registrations functions
  const createRegistration = (data: CreateRegistrationData) => {
    const courseOffering = courseOfferings.find(co => co.id === data.courseOfferingId);
    
    if (courseOffering) {
      const newRegistration: Registration = {
        id: Date.now().toString(),
        studentId: Date.now().toString(),
        courseOfferingId: data.courseOfferingId,
        studentName: data.studentName,
        studentEmail: data.studentEmail,
        courseName: courseOffering.courseName,
        courseTypeName: courseOffering.courseTypeName,
        registrationDate: new Date(),
      };
      setRegistrations(prev => [...prev, newRegistration]);
    }
  };

  const deleteRegistration = (id: string) => {
    setRegistrations(prev => prev.filter(r => r.id !== id));
  };

  const value: DataContextType = {
    // Course Types
    courseTypes,
    createCourseType,
    updateCourseType,
    deleteCourseType,

    // Courses
    courses,
    createCourse,
    updateCourse,
    deleteCourse,

    // Course Offerings
    courseOfferings,
    createCourseOffering,
    updateCourseOffering,
    deleteCourseOffering,

    // Registrations
    registrations,
    createRegistration,
    deleteRegistration,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};