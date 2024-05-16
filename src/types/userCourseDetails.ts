import { applicationStatus } from './user';

export interface Application {
    id: number,
    userId: number,
    college_id: number,
    course_id: number,
    college_course_id: number,
    college_application_status: applicationStatus,
    admission_form_no: string,
    college_comments: string | null
}