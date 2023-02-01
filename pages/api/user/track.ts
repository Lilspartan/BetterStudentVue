// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Database from "@replit/database";
const db = new Database()

export const config = {
    api: {
        bodyParser: true,
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	let parsed = JSON.parse(req.body);

	if (req.method === "POST") {
		let id = parsed.id;
		let assignment = parsed.assignment;

		let user = await db.get(id);

		if (user) {
			if (user.trackedAssignments.includes(assignment)) {
				user.trackedAssignments = user.trackedAssignments.filter(i => { return i !== assignment });
			} else {
				user.trackedAssignments.push(assignment);
			}

			await db.set(id, user);
			
			return res.json(user);
		} 

		res.status(404);
	} else {
		return res.status(404);
	}
}
