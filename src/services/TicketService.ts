
import { AppDataSource } from "../data-source";
import Ticket from "../entity/Ticket";
import TicketComment from "../entity/TicketComment";
import { ticketComment } from "../types/user";

const TicketRepository = AppDataSource.getRepository(Ticket);
const TicketCommentRepository = AppDataSource.getRepository(TicketComment);


export default class TicketServices {
    /**
     * @author Moin
     * @description This function saves the ticket in the database with the required parameters.
     */
    public static saveData = async (userId: number, collegeName: string, courseName: string, categoryName: string, email: string, registrationNo: number, grievance: string, ticketStatus: string ) => {
        const saveData = await TicketRepository.save({ userId: userId, collegeName: collegeName, courseName: courseName, categoryName: categoryName, email: email, registrationNo: registrationNo, grievance: grievance, ticketStatus: ticketStatus});
        return saveData;
    };
    /**
    * @author: Moin 
    * @description: this function get All ticket in the data base with require params
    */
    public static getTicketData = async (limit: number, offset: number, userId: number) => {
        let limitOffset = "";
        if (offset != 0 && limit != 0) {
            limitOffset = " LIMIT " + limit + " OFFSET " + offset;
        }
        let query = '';
            query = `SELECT tk.*, COUNT(tc.readComment) as UnreadComment
            FROM master_admission_ticket as tk
            LEFT JOIN master_admission_ticket_comment as tc ON tk.id = tc.ticketId AND tc.readComment = 'false' WHERE tk.userId=${userId} 
            GROUP BY tk.id, tk.userId, tk.email, tk.collegeName, tk.courseName, tk.categoryName,
                     tk.grievance, tk.ticketStatus, tk.adminReply, tk.createdAt, tk.updatedAt  `;
        

        query += limitOffset;
        const ticketData = TicketRepository.query(query);
        return ticketData;
    };
    /**
    * @author Moin 
    * @description This function finds user-wise ticket data in the database with the required parameters.
    */

    public static findUser = async (id: number) => {
        const user = await TicketRepository.findOneBy({ userId: id });
        return user;
    };
    /**
   * @author Moin 
   * @description This function saves a comment on a ticket in the database with the required parameters.
   */

    public static saveCommentData = async (TicketUserId: number, TicketId: number, comment: string, readComment: ticketComment, adminComment: ticketComment) => {
        const AddComment = new TicketComment();
        AddComment.userId = TicketUserId,
            AddComment.ticketId = TicketId,
            AddComment.Comment = comment,
            AddComment.readComment = readComment,
            AddComment.adminComment = adminComment;
        const createdTeacherToSubject = await TicketCommentRepository.save(AddComment);
        return createdTeacherToSubject;
    };
    /**
     * @author Moin
     * @description This function finds a ticket using the ticketId in the database with the required parameters.
     */

    public static findUserS = async (ticketId: number) => {
        const query = `SELECT tc.*,us.role FROM master_admission_ticket_comment as tc JOIN master_admission_users as us ON tc.userId=us.id WHERE tc.ticketId=${ticketId} `;
        const userData = TicketCommentRepository.query(query);
        return userData;
    };
    /**
    * @author Moin
    * @description This function updates the ticket status using the ticketId in the database with the required parameters.
    */

    public static upDateData = async (ticketId: number, ticketStatus: string) => {
        const updateResult = await TicketRepository.createQueryBuilder()
            .update(Ticket)
            .set({ ticketStatus: ticketStatus })
            .where('id = :id', { id: ticketId })
            .execute();
        return updateResult;
    };
    /**
   * @author Moin
   * @description This function searches for a ticket with specific values in the database with the required parameters.
   */

    public static searchTicketData = async (values: string, limit: number, offset: number, role: string, userId:number) => {
        let limitOffset = "";
        if (offset != 0 && limit != 0) {
            limitOffset = " LIMIT " + limit + " OFFSET " + offset;
        }
        let query = '';
        if (role == 'STUDENT') {
            query = `SELECT tk.id, tk.userId, tk.email, tk.collegeName, tk.courseName, tk.categoryName,
         tk.grievance, tk.ticketStatus, tk.adminReply, tk.createdAt, tk.updatedAt,
         COUNT(tc.readComment) as UnreadComment
          FROM master_admission_ticket as tk
          LEFT JOIN master_admission_ticket_comment as tc
          ON tk.id = tc.ticketId AND tc.readComment = 'false'
         WHERE (tk.email LIKE '%${values}%' OR tk.courseName LIKE '%${values}%' OR tk.collegeName LIKE '%${values}%' OR tk.   categoryName LIKE '%${values}%') AND tk.userId=${userId}
          GROUP BY tk.id, tk.userId, tk.email, tk.collegeName, tk.courseName, tk.categoryName,
          tk.grievance, tk.ticketStatus, tk.adminReply,  tk.createdAt, tk.updatedAt  `;
        } else if(role == 'SUPER_ADMIN') {
            query = `SELECT tk.id, tk.userId, tk.email, tk.collegeName, tk.courseName, tk.categoryName,
           tk.grievance, tk.ticketStatus, tk.adminReply,tk.createdAt, tk.updatedAt,
           COUNT(tc.readComment) as UnreadComment
           FROM master_admission_ticket as tk
           LEFT JOIN master_admission_ticket_comment as tc
           ON tk.id = tc.ticketId AND tc.readComment = 'true'
           WHERE tk.email LIKE '%${values}%' OR tk.courseName LIKE '%${values}%' OR tk.collegeName LIKE '%${values}"%' OR tk.categoryName LIKE '%${values}%' 
           GROUP BY tk.id, tk.userId, tk.email, tk.collegeName, tk.courseName, tk.categoryName,
           tk.grievance, tk.ticketStatus, tk.adminReply,tk.createdAt, tk.updatedAt   `;
        }else if(role === 'UNIVERSITY'){
            query = `SELECT tk.id, tk.userId, tk.email, tk.collegeName, tk.courseName, tk.categoryName,
            tk.grievance, tk.ticketStatus, tk.adminReply,tk.createdAt, tk.updatedAt,
            COUNT(tc.readComment) as UnreadComment
            FROM master_admission_ticket as tk
            LEFT JOIN master_admission_ticket_comment as tc
            ON tk.id = tc.ticketId AND tc.readComment = 'true'
            WHERE  tk.categoryName='Raise An Issue With The University' AND (tk.email LIKE '%${values}%' OR tk.courseName LIKE '%${values}%' OR tk.collegeName LIKE '%${values}"%' OR tk.categoryName LIKE '%${values}%') 
            GROUP BY tk.id, tk.userId, tk.email, tk.collegeName, tk.courseName, tk.categoryName,
            tk.grievance, tk.ticketStatus, tk.adminReply,tk.createdAt, tk.updatedAt `;
        }else if(role === 'ADMIN'){
            query = `SELECT tk.id, tk.userId, tk.email, tk.collegeName, tk.courseName, tk.categoryName,
            tk.grievance, tk.ticketStatus, tk.adminReply,tk.createdAt, tk.updatedAt,
            COUNT(tc.readComment) as UnreadComment
            FROM master_admission_ticket as tk
            LEFT JOIN master_admission_ticket_comment as tc
            ON tk.id = tc.ticketId AND tc.readComment = 'true'
            WHERE  tk.categoryName='Raise An Issue With The College' AND (tk.email LIKE '%${values}%' OR tk.courseName LIKE '%${values}%' OR tk.collegeName LIKE '%${values}"%' OR tk.categoryName LIKE '%${values}%') 
            GROUP BY tk.id, tk.userId, tk.email, tk.collegeName, tk.courseName, tk.categoryName,
            tk.grievance, tk.ticketStatus, tk.adminReply,tk.createdAt, tk.updatedAt `;
        }

        query += limitOffset;
        const ticketData = TicketRepository.query(query);
        return ticketData;
    };
    /**
   * @author Moin
   * @description This function deletes a ticket comment by ID in the database with the required parameters.
   */

    public static deleteCommentById = async (id: number) => {
        return await TicketRepository
            .createQueryBuilder()
            .delete()
            .from(TicketComment)
            .where('id = :id', { id: id })
            .execute();
    };

    /**
    * @author Moin 
    * @description This function filters year-wise ticket data in the database with the required parameters.
    */

    public static getYearWiseTicketDetails = async (year: number, limit: number, offset: number, role: string, userId:number) => {
        let limitOffset = "";
        if (offset !== 0 && limit !== 0) {
            limitOffset = " LIMIT " + limit + " OFFSET " + offset;
        }
        let query = '';
        if (role === 'STUDENT') {
            query = `SELECT tk.*, COUNT(tc.readComment) as UnreadComment
                FROM master_admission_ticket as tk
                LEFT JOIN master_admission_ticket_comment as tc ON tk.id = tc.ticketId WHERE tc.readComment = 'false'  AND tk.userId=${userId}
                GROUP BY tk.id, tk.userId, tk.email, tk.collegeName, tk.courseName, tk.categoryName,
                         tk.grievance, tk.ticketStatus, tk.adminReply, tk.createdAt, tk.updatedAt  `;
        } else if (role === 'SUPER_ADMIN') {
            query = ` SELECT tk.*, COUNT(tc.readComment) as UnreadComment
            FROM master_admission_ticket as tk
            LEFT JOIN master_admission_ticket_comment as tc ON tk.id = tc.ticketId AND tc.readComment = 'true'
            WHERE YEAR(tk.createdAt) = ${year}
            GROUP BY tk.id, tk.userId, tk.email, tk.collegeName, tk.courseName, tk.categoryName,
                     tk.grievance, tk.ticketStatus, tk.adminReply, tk.createdAt, tk.updatedAt;`;
        } else if (role === 'UNIVERSITY') {
            query = `  SELECT tk.*, COUNT(tc.readComment) as UnreadComment
            FROM master_admission_ticket as tk
            LEFT JOIN master_admission_ticket_comment as tc ON tk.id = tc.ticketId AND tc.readComment = 'true'
            WHERE YEAR(tk.createdAt) = ${year} AND tk.categoryName='Raise An Issue With The University'
            GROUP BY tk.id, tk.userId, tk.email, tk.collegeName, tk.courseName, tk.categoryName,
                     tk.grievance, tk.ticketStatus, tk.adminReply, tk.createdAt, tk.updatedAt;`;
        } else if (role === 'ADMIN') {
            query = ` SELECT tk.*, COUNT(tc.readComment) as UnreadComment
FROM master_admission_ticket as tk
LEFT JOIN master_admission_ticket_comment as tc ON tk.id = tc.ticketId AND tc.readComment = 'true'
WHERE YEAR(tk.createdAt) = 2024 AND tk.categoryName='Raise An Issue With The College'
GROUP BY tk.id, tk.userId, tk.email, tk.collegeName, tk.courseName, tk.categoryName,
         tk.grievance, tk.ticketStatus, tk.adminReply, tk.createdAt, tk.updatedAt;`;
        }
        query += limitOffset;
        const ticketData = TicketRepository.query(query);
        return ticketData;
    };
    
}