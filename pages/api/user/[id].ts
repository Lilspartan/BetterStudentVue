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
	if (req.method === "GET") {
		let id = req.query.id;

		let user = await db.get(id);

		if (user !== null) {
			return res.json(user);
		}
		
		return res.status(404);
	}
}
