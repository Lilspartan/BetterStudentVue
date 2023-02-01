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

		let user = await db.get(id);

		if (user !== null) {
			return res.json(user);
		} else {
			user = await db.set(id, { trackedAssignments: [] });
			return res.json({ message: "USER_CREATED" });
		}
	} else {
		return res.status(404);
	}
}
