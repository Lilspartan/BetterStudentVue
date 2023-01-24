import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import { useEffect, useState } from "react";

import { login } from "../utils/studentVue";

const Home: NextPage = (props) => {
	const [gradebook, setGradebook] = useState(props.grades);
	
  return (
    <div>
			{ gradebook !== null && (
				<>
					<div>
						{gradebook.Gradebook.Courses.Course.map(course => {

							var assignments = course.Marks.Mark.Assignments.Assignment;
							// if (assignments.length)
					
							return (
								<div>
									<h1>{ course.Title }</h1>
	
									{[ ...course.Marks.Mark.Assignments.Assignment ].map(assignment => (
										<h2>h</h2>
									))}
									
									<pre>{JSON.stringify(course.Marks.Mark.Assignments.Assignment, null, 4)}</pre>
									
									<div className = "flex flex-col">
										
									</div>
								</div>
					)})}
					</div>
					
					<pre>
						{JSON.stringify(gradebook, null, 4)}
					</pre>	
				</>
			) }
		</div>
  )
}

export async function getStaticProps() {
	const client = await login("https://wa-nor-psv.edupoint.com", "1058221", process.env.PASSWORD)
			
  return { props: { grades: JSON.parse(await client.getGradebook()) } }
}

export default Home