export interface CourseType {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Course {
  id: string;
  name: string;
  createdAt: Date;
}

export interface CourseOffering {
  id: string;
  courseId: string;
  courseTypeId: string;
  courseName: string;
  courseTypeName: string;
  createdAt: Date;
}

export interface Student {
  id: string;
  name: string;
  email: string;
}

export interface Registration {
  id: string;
  studentId: string;
  courseOfferingId: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  courseTypeName: string;
  registrationDate: Date;
}

export interface CreateCourseTypeData {
  name: string;
}

export interface CreateCourseData {
  name: string;
}

export interface CreateCourseOfferingData {
  courseId: string;
  courseTypeId: string;
}

export interface CreateRegistrationData {
  studentName: string;
  studentEmail: string;
  courseOfferingId: string;
}