-- Store Procedure for select prefrences for student side (4th step)
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getCollegeDetails`(IN where_collegeName VARCHAR(255), 
    IN where_degree VARCHAR(255),
    IN where_courseName VARCHAR(255),
    IN where_groupName VARCHAR(255),
    IN where_collegeType VARCHAR(255),
    IN where_city VARCHAR(255),
    IN where_state VARCHAR(255),
		IN where_degreeType VARCHAR(255))
BEGIN
	SET @query = CONCAT(
        "SELECT clm.college_name_admission, ",
        "cam.course_name_admission, ",
        "clm.college_code_admission, ",
        "clm.id, ",
				"cca.id AS college_course_id, ",
        "clm.college_type, ",
        "clm.city, ",
        "clm.state, ",
        "cam.degree ",
        "FROM master_admission_course AS cam ",
        "JOIN master_admission_college_course AS cca on cam.id = cca.course_id_admission ",
        "JOIN master_admission_college AS clm on clm.id = cca.college_id_admission ",
        "Left JOIN master_admission_subject_group as sga on sga.id = cca.subject_group_id_admission ",
        "WHERE 1 = 1 ", 
        IF(where_collegeName <> '', CONCAT("AND clm.college_name_admission LIKE CONCAT('%', '", where_collegeName, "', '%') "), ' AND 1 '),
        IF(where_degree <> '', CONCAT("AND cam.degree LIKE CONCAT('%', '", where_degree, "', '%') "), ' AND 1 '),
        IF(where_courseName <> '', CONCAT("AND cam.course_name_admission LIKE CONCAT('%', '", where_courseName, "', '%') "), ' AND 1 '),
        IF(where_groupName <> '', CONCAT("AND sga.group_combination_admission LIKE CONCAT('%', '", where_groupName, "', '%') "), ' AND 1 '),
        IF(where_collegeType <> '', CONCAT("AND clm.college_type = '", where_collegeType, "' "), ' AND 1 '),
        IF(where_city <> '', CONCAT("AND clm.city LIKE CONCAT('%', '", where_city, "', '%') "), ' AND 1 '),
        IF(where_state <> '', CONCAT("AND clm.state LIKE CONCAT('%', '", where_state, "', '%') "), ' AND 1 '),
				IF(where_degreeType <> '', CONCAT("AND cam.degree IN ('", REPLACE(where_degreeType, ',', '\',\''), "') "), ' AND 1 ')
        );
        
    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END

-- store procedure to get single user Personal Education and Documents data
DELIMITER $$
CREATE PROCEDURE get_single_userPersonalEduDoc(IN user_id INT)
BEGIN
    SELECT
        JSON_OBJECT(
            'id', u.id,
            'firstName', u.firstName,
            'lastName', u.lastName,
            'nameAsOnMarksheet', u.nameAsOnMarksheet,
            'email', u.email,
            'mobileno', u.mobileno,
            -- 'alternativeMobileno', u.alternativeMobileno,
            'dob', u.dob,
            'gender', u.gender,
            'bloodGroup', u.bloodGroup,
            'nameAsPerAadharCard', u.nameAsPerAadharCard,
            'aadharCardno', u.aadharCardno,
            'city', u.city,
            'state', u.state,
            'address', u.address,
            'minority', u.minority,
            'pincode', u.pincode,
            'motherName', u.motherName,
            'fatherName', u.fatherName,
            'parentsMobileno', u.parentsMobileno,
            'admissionType', u.admissionType,
			'religion', u.religion,
            -- 'specificCategory', u.specificCategory,
            'role', u.role,
            'keycloakId', u.keycloakId,
            'status', u.status,
            'registrationNo', u.registrationNo,
            'imagesName', u.imagesName,
            'learningDisability', u.learningDisability,
            'category', u.category,
            'admissionCategory', u.admissionCategory
        ) as userDetails,
        JSON_OBJECT(
            'id',edu.id,
            'userId',edu.userId,
            -- 'category',edu.category,
            'sscObtainedMarks',edu.sscObtainedMarks,
            'sscOutOf',edu.sscOutOf,
            'sscPercentage', edu.sscPercentage, 
            'sscGrade', edu.sscGrade,
            'hscBoard',edu.hscBoard,
            'hscCollegeName',edu.hscCollegeName,
            'hscPassingState', edu.hscPassingState,
            'hscPassingYear',edu.hscPassingYear,
            'hscSeatNo',edu.hscSeatNo,
            'hscMarksObtained',edu.hscMarksObtained,
            'hscOutOf',edu.hscOutOf,
            'hscStream',edu.hscStream,
            'hscGrade',edu.hscGrade,
            'hscNoOfAttempt',edu.hscNoOfAttempt,
            'hscPercentage',edu.hscPercentage,
            -- 'achievements',edu.achievements,
            'biologyPercentage',edu.biologyPercentage,
            'mathPercentage',edu.mathPercentage,
            -- 'biology',edu.biology,
			-- 'biologyOutOf',edu.biologyOutOf,
			-- 'biologyMarksObtained',edu.biologyMarksObtained,
            -- 'math',edu.math,
			-- 'mathOutOf',edu.mathOutOf,
			-- 'mathObtainedMarks',edu.mathObtainedMarks,
            'inHouse',edu.inHouse,
            'ugCollegename',edu.ugCollegename,
            'ugCourseName',edu.ugCourseName,
            'ugPassingMonth',edu.ugPassingMonth,
            'ugPassingYear',edu.ugPassingYear,
            'ugSeatNo',edu.ugSeatNo,
            'ugNoOfAttempt',edu.ugNoOfAttempt,
            'ugEntranceMarks',edu.ugEntranceMarks,
            'EntranceExam',edu.EntranceExam,
            'EntranceYear',edu.EntranceYear,
            'resultStatus',edu.resultStatus,
            'ugMarksObtained',ugMarksObtained,
            'ugOutof',edu.ugOutof,
            'ugPercentage',edu.ugPercentage,
            'ugGrade',edu.ugGrade,
            'ugselectChoice',edu.ugselectChoice,
            'hscselectChoice',edu.hscselectChoice,
            'sscselectChoice',edu.sscselectChoice,
            'ugQualificationName',edu.ugQualificationName,
            'admissionType',edu.admissionType,
            'hscPassingMonth',edu.hscPassingMonth,
            'admissionYear',edu.admissionYear
        ) as education,
		CONCAT(
			'[',
			GROUP_CONCAT(
				JSON_OBJECT(
					'id', doc.id,
					'userId', doc.userId,
					'documentType', doc.documentType,
					'fileName', doc.fileName,
					'admissionType', doc.admissionType,
					'errata', doc.errata,
					'updated_step', doc.updated_step,
                    'verify', doc.verify,
					'createdAt', doc.createdAt,
					'updatedAt', doc.updatedAt 
				)),
			']' 
		) AS documents 
    FROM
	    master_admission_users AS u
	    LEFT JOIN master_admission_educational_details AS edu ON u.id = edu.userId
	    JOIN master_admission_documents AS doc ON u.id = doc.userId 
    WHERE
	    u.id = user_id 
    GROUP BY
	    u.id,edu.id,doc.userId;
END $$
DELIMITER ;


-- store procedure to get all collegecourses
DELIMITER $$
CREATE PROCEDURE get_all_collegeCourses()
BEGIN
    SELECT
	    cc.id,
        cc.admissionYear,
        cc.remaing_intake_admission,
	    cc.intake_admission,
	    cc.academic_year_admission,
	    cc.college_id_admission,
	    cc.course_id_admission,
	    cc.faculty_id_admission,
	    cc.department_id_admission,
	    cc.subject_group_id_admission,
	    c.college_name_admission,
	    co.course_name_admission,
	    fa.faculty_name_admission,
	    de.department_name_admission,
	    sg.group_combination_admission 
    FROM
        master_admission_college_course AS cc
	LEFT JOIN master_admission_college AS c ON cc.college_id_admission = c.id
	LEFT JOIN master_admission_course as co on cc.course_id_admission = co.id
	LEFT JOIN master_admission_faculty as fa on cc.faculty_id_admission = fa.id
	LEFT JOIN master_admission_department as de on cc.department_id_admission = de.id
	LEFT JOIN master_admission_subject_group as sg on cc.subject_group_id_admission = sg.id where co.id = sg.course_id_admission;
END $$
DELIMITER ;


-- store procedure to get collegeCourses with pagination and search
DELIMITER $$
CREATE PROCEDURE college_courses(IN numOfLimit INT, IN numOfOffset INT, IN search VARCHAR(50))
BEGIN
    SET @query = '
        SELECT
            cc.id,
            cc.admissionYear,
            cc.remaining_intake_admission,
            cc.intake_admission,
            cc.academic_year_admission,
            cc.college_id_admission,
            cc.course_id_admission,
            cc.faculty_id_admission,
            cc.department_id_admission,
            cc.subject_group_id_admission,
            cc.courseStatus,
            c.college_name_admission,
            c.collegeStatus,
            co.course_name_admission,
            fa.faculty_name_admission,
            de.department_name_admission,
            sg.group_combination_admission 
        FROM
            master_admission_college_course AS cc
        LEFT JOIN master_admission_college AS c ON cc.college_id_admission = c.id
        LEFT JOIN master_admission_course AS co ON cc.course_id_admission = co.id
        LEFT JOIN master_admission_faculty AS fa ON cc.faculty_id_admission = fa.id
        LEFT JOIN master_admission_department AS de ON cc.department_id_admission = de.id
        LEFT JOIN master_admission_subject_group AS sg ON cc.subject_group_id_admission = sg.id 
        WHERE 1=1 '; 
    
    IF search != '' THEN
        SET @query = CONCAT(@query, ' AND (c.college_name_admission LIKE \'%', search, '%\' OR sg.group_combination_admission LIKE \'%', search, '%\' OR co.course_name_admission LIKE \'%', search, '%\') ');
    END IF;

    SET @query = CONCAT(@query, ' LIMIT ', numOfOffset, ',', numOfLimit);

    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END
$$;
DELIMITER $$;


-- store procedure to get all subjectgorups data
DELIMITER $$
CREATE PROCEDURE get_all_subjectGroups()
BEGIN
    SELECT 
        sg.id,
	    sg.group_combination_admission,
	    sg.subject_ids_admission,
	    sg.course_id_admission,
        sg.medium,
	    co.course_name_admission,
	    co.course_type_admission
    FROM
        master_admission_subject_group AS sg
    LEFT JOIN master_admission_course AS co ON sg.course_id_admission = co.id;
END $$
DELIMITER ;


-- Get single subjectGroup
DELIMITER $$
CREATE PROCEDURE get_single_subjectGroup(IN subjectGroupId INT)
BEGIN
    SELECT 
        sg.id,
	    sg.group_combination_admission,
	    sg.subject_ids_admission,
	    sg.course_id_admission,
        sg.medium,
	    co.course_name_admission,
	    co.course_type_admission
    FROM
        master_admission_subject_group AS sg
    LEFT JOIN master_admission_course AS co ON sg.course_id_admission = co.id WHERE sg.id = subjectGroupId;
END $$
DELIMITER ;

CALL get_single_subjectGourps(3);


-- store procedure to get subject groups with pagination and search
DELIMITER $$
CREATE PROCEDURE subject_groups(IN numOfLimit INT, IN numOfOffset INT, IN search VARCHAR(50))
BEGIN
    SET @query = '
        SELECT
            sg.id,
            sg.group_combination_admission,
						sg.subject_ids_admission,
            sg.course_id_admission,
            sg.medium,
            co.course_name_admission,
            co.course_type_admission
        FROM
            master_admission_subject_group AS sg
        LEFT JOIN master_admission_course AS co ON sg.course_id_admission = co.id 
				WHERE 1=1 ';
    
    IF search != '' THEN
        SET @query = CONCAT(@query, 'AND (sg.group_combination_admission LIKE \'%', search, '%\' OR co.course_name_admission LIKE \'%', search, '%\') ');
    END IF;

    SET @query = CONCAT(@query, 'LIMIT ', numOfOffset, ',', numOfLimit);

    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END
$$;
DELIMITER $$;


-- store procedure to get college_courses_by_course_ids
DELIMITER $$
CREATE PROCEDURE college_courses_by_course_ids(IN numOfLimit INT, IN numOfOffset INT, IN search VARCHAR(50), IN courseIds VARCHAR(255))
BEGIN
    SET @query = '
        SELECT
            cc.id,
            cc.intake_admission,
            cc.academic_year_admission,
            cc.college_id_admission,
            cc.course_id_admission,
            cc.faculty_id_admission,
            cc.department_id_admission,
            cc.subject_group_id_admission,
            cc.courseStatus,
            cc.admissionYear,
            cc.remaining_intake_admission,
            c.college_name_admission,
            c.collegeStatus,
            co.course_name_admission,
            fa.faculty_name_admission,
            de.department_name_admission,
            sg.group_combination_admission 
        FROM
            master_admission_college_course AS cc
        LEFT JOIN master_admission_college AS c ON cc.college_id_admission = c.id
        LEFT JOIN master_admission_course AS co ON cc.course_id_admission = co.id
        LEFT JOIN master_admission_faculty AS fa ON cc.faculty_id_admission = fa.id
        LEFT JOIN master_admission_department AS de ON cc.department_id_admission = de.id
        LEFT JOIN master_admission_subject_group AS sg ON cc.subject_group_id_admission = sg.id 
        WHERE 1=1 ';

    IF courseIds != '' THEN
        SET @query = CONCAT(@query, ' AND cc.course_id_admission IN (', courseIds, ') ');
    END IF;

    IF search != '' THEN
        SET @query = CONCAT(@query, ' AND (c.college_name_admission LIKE \'%', search, '%\' OR sg.group_combination_admission LIKE \'%', search, '%\' OR co.course_name_admission LIKE \'%', search, '%\') ');
    END IF;

    SET @query = CONCAT(@query, ' LIMIT ', numOfOffset, ',', numOfLimit);

    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END
$$;
DELIMITER $$;

