import { ViewEntity, ViewColumn } from "typeorm";
import { AppDataSource } from "../data-source";

@ViewEntity({
    name: 'v_master_admission_college_course',
    expression: (connection: typeof AppDataSource) => connection
        .createQueryBuilder()
        .select([
            'cc.id as id',
            'cc.intake_admission as intake_admission',
            'cc.academic_year_admission as academic_year_admission',
            'cc.college_id_admission as college_id_admission',
            'cc.course_id_admission as course_id_admission',
            'cc.faculty_id_admission as faculty_id_admission',
            'cc.department_id_admission as department_id_admission',
            'cc.subject_group_id_admission as subject_group_id_admission',
            'c.college_name_admission as college_name_admission',
            'co.course_name_admission as course_name_admission',
            'fa.faculty_name_admission as faculty_name_admission',
            'de.department_name_admission as department_name_admission',
            'sg.group_combination_admission as group_combination_admission'
        ])
        .from('master_admission_college_course', 'cc')
        .leftJoin('master_admission_college', 'c', 'cc.college_id_admission = c.id')
        .leftJoin('master_admission_course', 'co', 'cc.course_id_admission = co.id')
        .leftJoin('master_admission_faculty', 'fa', 'cc.faculty_id_admission = fa.id')
        .leftJoin('master_admission_department', 'de', 'cc.department_id_admission = de.id')
        .leftJoin('master_admission_subject_group', 'sg', 'cc.subject_group_id_admission = sg.id')
        // .where('co.id = sg.course_id_admission')
})
export default class ViewCollegeCourse {
    @ViewColumn()
    id: number;

    @ViewColumn()
    college_id_admission: number;

    @ViewColumn()
    college_name_admission: string;

    @ViewColumn()
    faculty_id_admission: number;

    @ViewColumn()
    faculty_name_admission: string;

    @ViewColumn()
    department_id_admission: number;

    @ViewColumn()
    department_name_admission: string;

    @ViewColumn()
    course_id_admission: number;

    @ViewColumn()
    course_name_admission: string;

    @ViewColumn()
    academic_year_admission: string;

    @ViewColumn()
    intake_admission: number;

    @ViewColumn()
    subject_group_id_admission: number;

    @ViewColumn()
    group_combination_admission: number;
}
