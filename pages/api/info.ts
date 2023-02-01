// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { login } from '../../utils/studentVue';

import Database from "@replit/database";
const db = new Database();

import axios from "axios";

export const config = {
    api: {
        bodyParser: true,
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	let parsed = JSON.parse(req.body);
	
	const client = await login(parsed.url, parsed.username, parsed.password);
	const gradebook = JSON.parse(await client.getGradebook());
	const schedule = JSON.parse(await client.getSchedule(0))
	const calendar = JSON.parse(await client.getCalendar());
	const info = JSON.parse(await client.getStudentInfo());
	const messages = JSON.parse(await client.getMessages());
	const attendance = JSON.parse(await client.getAttendance());

	let user = await db.get(parsed.username);
	let newUser = {
		trackedAssignments: [],
	}
	if (user === null) {
		await db.set(parsed.username, newUser);
		user = newUser;
	}
	
	if (gradebook.RT_ERROR !== undefined) {
		return res.status(401).json({
			error: "invalid User name or Password",
		})
	} else {
		return res.status(200).json({
			gradebook: gradebook.Gradebook,
			schedule: schedule.StudentClassSchedule,
			calendar: calendar.CalendarListing,
			info: info.StudentInfo,
			messages: messages.PXPMessagesData,
			attendance: attendance.Attendance,
			user,
		})
	}
}
