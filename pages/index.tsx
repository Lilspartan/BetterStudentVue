import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import { MdToday } from 'react-icons/md';
import { AiOutlineClose, AiFillFlag } from 'react-icons/ai';

import { useEffect, useState } from "react";
import { login, getDistrictUrls } from "../utils/studentVue";

const Home: NextPage = ({ urls }: { urls: any[] }) => {
	const [gradebook, setGradebook] = useState(null);
	const [schedule, setSchedule] = useState(null);
	const [calendar, setCalendar] = useState(null);
	const [messages, setMessages] = useState(null);
	const [studentInfo, setStudentInfo] = useState(null);
	const [attendance, setAttendance] = useState(null);
	const [darkMode, setDarkMode] = useState(false);
	const [highlightMissing, setHighlightMissing] = useState(true);
	const [selectedTab, setSelectedTab] = useState("Home");
	const [user, setUser] = useState(null);

	// Sign in states
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [district, setDistrict] = useState("https://wa-nor-psv.edupoint.com");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (location.origin === "https://studentvuecalculator.gabekrahulik.repl.co") {
			location.href = "https://better-studentvue.gabekrahulik.dev";
		}
	}, [])

	const signIn = async (e) => {
		setLoading(true);
		e.preventDefault();

		// check for info
		if (district === "") { alert("Please choose a district"); return setLoading(false); }
		if (username === "") { alert("Please enter your username"); return setLoading(false); }
		if (password === "") { alert("Please enter your password"); return setLoading(false); }

		// get gradebook information
		const res = await fetch('/api/info', {
			method: "POST",
			body: JSON.stringify({
				username, password,
				url: district
			}),
		})
		const data = await res.json();

		// set gradebook
		if (data.gradebook !== undefined) {
			setGradebook(data.gradebook);
			setSchedule(data.schedule);
			setCalendar(data.calendar);
			setStudentInfo(data.info);
			setMessages(data.messages);
			setAttendance(data.attendance);
			setUser(data.user);

			console.log(data.user)

			setLoading(false);
		} else {
			alert("Incorrect username or password");
			setLoading(false);
		}
	}

	const flag = async (id) => {
		let res = await fetch('/api/user/track', {
			method: "POST",
			body: JSON.stringify({
				id: username,
				assignment: id
			}),
		})
		let data = await res.json();
		console.log(data)
		if (data.trackedAssignments !== undefined) {
			setUser(data);
		}
	}

	return (
		<div className="">
			<div className="bg-background text-white min-h-screen">
				{gradebook !== null ? (
					<>
						<div className="overflow-x-scroll relative top-0 pt-2 flex flex-row bg-primary px-4 w-full">
							{["Home", "Gradebook", "Schedule", "Attendance"].map((tab) => {
								var selected = tab === selectedTab;
								return (
									<div key={tab} onClick={() => { setSelectedTab(tab) }} className={`px-8 py-2 font-bold ${selected ? "bg-background rounded-t-lg" : "bg-primary cursor-pointer"}`}>
										{tab}
									</div>
								)
							})}

							<div onClick={signIn} className={`right-0 px-8 py-2 font-bold bg-primary hover:bg-background rounded-t-lg cursor-pointer ${loading && "animate-pulse"}`}>
								{ loading ? "Refreshing..." : "Refresh" }
							</div>
							
							<div onClick={() => { location.reload(); }} className={`right-0 px-8 py-2 font-bold bg-primary hover:bg-background rounded-t-lg cursor-pointer`}>
								Logout
							</div>
						</div>
						<div className="p-2">
							<MainArea flag={flag} user={user} selectedTab={selectedTab} gradebook={gradebook} schedule={schedule} calendar={calendar} studentInfo={studentInfo} messages={messages} attendance={attendance} />
						</div>
					</>
				) : (
					<div className="p-4 min-h-screen bg-background">
						<div className="bg-primary inline-block p-4 rounded-lg mx-auto">
							<h1 className="mb-2 text-lg font-bold">Select your District</h1>
							<div className="mx-8 flex flex-col">
								{urls.map(url => (
									<div key={url.Name}>
										{district === url.PvueURL && "font-bold" && "> "}
										<a className={`cursor-pointer hover:font-bold transition duration-200 ${district === url.PvueURL && "font-bold"}`} onClick={() => {
											setDistrict(url.PvueURL)
										}}>{url.Name}</a>
									</div>
								))}
							</div>
						</div>

						<form className="flex flex-col mt-8" onSubmit={(e) => { signIn(e) }}>
							<h1 className="text-center font-bold text-2xl mb-2">StudentVue Login</h1>
							<div className="flex flex-col mx-auto text-lg mb-8">
								<label htmlFor="username" className="font-bold">Username</label>
								<input className="w-48 rounded-sm text-white bg-primary px-4 py-1 ring-accent" type="text" id="username" value={username} onChange={(e) => { setUsername(e.target.value) }} />
								<label htmlFor="password" className="font-bold mt-4">Password</label>
								<input className="w-48 rounded-sm text-white bg-primary px-4 py-1" type="password" id="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
							</div>
							<div className="w-1/2 lg:w-1/3 mx-auto">
								<span className={`transition duration-500 w-full text-center font-bold mb-4 block ${loading ? "opacity-100 animate-pulse" : "opacity-0"}`}>LOADING...</span>

								{!loading && <a role="submit" className="button" onClick={(e) => { signIn(e) }}>Sign In</a>}
							</div>
							<input type="submit" style={{ display: "none" }} />
						</form>
					</div>
				)}
			</div>
		</div>
	)
}

export async function getStaticProps() {
	// for now, get districts in my area
	const urls = await getDistrictUrls("98028");

	return { props: { urls: JSON.parse(urls).DistrictLists.DistrictInfos.DistrictInfo } }
}

const GradeBook = ({ gradebook, user, flag }) => {
	return (
		<>
			<div className="flex flex-row">

				{/*<a className = {`setting ${highlightMissing && "on"}`} onClick = {() => {
					setHighlightMissing(!highlightMissing);
				}}>Highlight Missing Assignments</a>*/}
			</div>

			{gradebook.Courses.Course.map(course => {
				return (
					<Course key={course.Period} course={course} user={user} flag={flag} />
				)
			})}
		</>
	)
}

const Schedule = ({ schedule }) => {
	return (
		<div className="flex flex-col gap-4 mt-12">
			{schedule !== null && schedule.TodayScheduleInfoData.SchoolInfos.SchoolInfo.Classes.ClassInfo.map((course) => {
				return (
					<div key={course.Period} className="flex flex-col bg-primary w-full rounded-lg px-8 py-4">
						<span className="font-bold text-xl">Period {course.Period}</span>
						<span className="text-lg font-bold">{course.ClassName}</span>
						<span className="">{course.StartTime} - {course.EndTime}</span>
						<span className="">Room {course.RoomName}</span>
					</div>
				)
			})}
		</div>
	)
}

const Course = ({ course, user, flag }) => {
	// maximum points possible in the class
	const [maxPoints, setMaxPoints] = useState(0);
	// total points earned in the class
	const [earnedPoints, setEarnedPoints] = useState(0);
	// array of assignments
	const [assignments, setAssignments] = useState([]);
	// catgeories for score weighting
	const [categories, setCategories] = useState(null);
	// if the class assignments table is open or not
	const [open, setOpen] = useState(false);

	const [advancedEditor, setAdvancedEditor] = useState(false);

	useEffect(() => {
		(async () => {
			// if there is only one assignment, then the Assignments.Assignment will not be an array
			// this ensures it's always an array
			var temp = course.Marks.Mark.Assignments.Assignment;
			if (temp === undefined) {
				temp = [];
			} else if (!temp.length) {
				temp = [course.Marks.Mark.Assignments.Assignment]
			}

			await setAssignments(temp)

			if (course.Marks.Mark.GradeCalculationSummary && course.Marks.Mark.GradeCalculationSummary.AssignmentGradeCalc !== undefined) {
				setCategories(course.Marks.Mark.GradeCalculationSummary.AssignmentGradeCalc.filter((a) => {
					return a.Weight !== "100%"
				}))
			}
		})()
	}, [])

	useEffect(() => {
		// add up all the points from the assignments
		// could use the ones from studentvue but this makes sure everything works out
		let maxRunningTotal = 0;
		let earnedRunningTotal = 0;

		assignments.forEach(async (assignment) => {
			// scores are saved as either of the following:
			// "5.00 / 5.00" - assignment is graded
			// "5.00 Points Possible" - assignment is not graded yet
			var splitPoints = assignment.Points.split("/");

			if (splitPoints.length > 1) {
				if (categories !== null && categories !== undefined) {
					let currentCategory = categories.filter(c => {
						return c.Type === assignment.Type;
					})

					if (currentCategory.length === 1) {
						let weightPct = Number(currentCategory[0].Weight.replace(/%/g, '')) / 100;
						maxRunningTotal += Number(splitPoints[1]) * 1;
						earnedRunningTotal += Number(splitPoints[0]) * 1;
					} else {
						maxRunningTotal += Number(splitPoints[1]);
						earnedRunningTotal += Number(splitPoints[0]);
					}
				} else {
					maxRunningTotal += Number(splitPoints[1]);
					earnedRunningTotal += Number(splitPoints[0]);
				}
			}
		})

		setMaxPoints(maxRunningTotal);
		setEarnedPoints(earnedRunningTotal);
	}, [assignments])

	const updateScore = async (assignment, score) => {
		let editedAssignment = null;
		for (let i = 0; i < assignments.length; i++) {
			if (assignments[i].GradebookID === assignment.GradebookID) {
				editedAssignment = i;
			}
		}

		if (editedAssignment !== null) {
			let temp = assignments;
			let splitPoints = assignment.Points.split("/");
			temp[editedAssignment].Points = score.replace(/^0+/, '') + " / " + splitPoints[1];
			await setAssignments([...temp]);
		}
	}

	const r_range = (min, max) => {
		return Math.floor(Math.random() * (max - min) + min);
	}

	const addAssignment = async (points) => {
		let temp = assignments;
		temp.unshift({
			"GradebookID": r_range(0, 999999999),
			"Measure": "Example Assignment",
			"Type": "Classwork",
			"Date": r_range(1, 12) + "/" + r_range(1, 30) + "/" + r_range(2000, 2050),
			"DueDate": r_range(1, 12) + "/" + r_range(1, 30) + "/" + r_range(2000, 2050),
			"Score": points + " out of " + points,
			"ScoreType": "Raw Score",
			"Points": points + " / " + points,
			"Notes": "",
			"TeacherID": "-1",
			"StudentID": "0",
			"MeasureDescription": "",
			"added": true,
		})
		setAssignments([...temp]);
	}

	return (
		<div className="mx-1 lg:px-8 py-2">
			<div className="cursor-pointer bg-primary rounded-lg" onClick={() => {
				setOpen(!open);
			}}>
				<div className="flex flex-row">
					<div className="w-24 lg:w-36 my-auto px-6 py-4 text-center text-5xl font-bold border-r-2 flex flex-col border-background">{course.Marks.Mark.CalculatedScoreString} <span className="text-sm font-normal opacity-60">{course.Marks.Mark.CalculatedScoreRaw}%</span></div>
					<div className="flex flex-col p-1 lg:border-r-2 border-background px-4 lg:w-2/3">
						<h1 className="font-bold text-sm lg:text-xl">Period {course.Period} {course.Title}</h1>
						<h2 className="text-sm opacity-70 font-bold">{course.Staff}</h2>
						<h2 className="text-sm opacity-70">Room {course.Room}</h2>
						{categories !== null && categories !== undefined && categories.length > 1 && <span className="text-red-500 italic opacity-80">This class uses weighted grading, some of the info may be incorrect</span>}
						<div className="inline-block lg:hidden">
							<div className="flex flex-col">
								<h3 className="mt-4">{earnedPoints} / {maxPoints} Points | {Math.round(Number((earnedPoints / maxPoints).toFixed(4)) * 100)}%</h3>
							</div>
						</div>
					</div>
					<div className="flex flex-col hidden lg:inline-block p-2">
						<h3 className="ml-2">{earnedPoints} / {maxPoints}</h3>
						<h3 className="ml-2 opacity-60">{assignments.length} Assignments</h3>
					</div>
				</div>

			</div>
			{open && (
				<>
					<CoursePanel categories = {categories} course={course} assignments={assignments} user={user} flag={flag} />

					{advancedEditor && (
						<>
							<div className="mt-6">
								<a className="font-bold ml-6 my-6 cursor-pointer" onClick={() => { addAssignment(15) }}>Add Assignment</a>
							</div>
							<div className="max-w-screen overflow-x-scroll">
								<table className="ml-4">
									<thead>
										<tr className="text-left">
											<th>Due Date</th>
											<th>Points</th>
											<th>Change Earned</th>
											<th>Name</th>
										</tr>
									</thead>

									<tbody>
										{assignments.map((assignment, i) => {
											var splitPoints = assignment.Points.split("/");

											return (
												<tr key={assignment.GradebookID} className={`${assignment.Notes.includes("Missing  ") ? "text-red-500" : "text-white"}`}>
													<td className="pr-8">{assignment.DueDate}</td>
													<td className="pr-8">{assignment.Points}</td>
													<td className="pr-8 flex flex-row">{splitPoints.length > 1 ? (
														<div className="">
															<input className="w-24 rounded-sm text-white bg-primary px-1 text-center" type="number" value={Number(splitPoints[0])} onChange={(e) => {
																updateScore(assignment, e.target.value);
															}} />
														</div>
													) : <span className="italic opacity-60">Not Graded</span>}</td>
													<td className="pr-8">{assignment.Measure}</td>
												</tr>
											)
										})}
									</tbody>
								</table>
							</div>
						</>
					)}
				</>
			)}
		</div>
	)
}

const CoursePanel = ({ course, assignments, user, flag, categories }) => {
	const [goalPct, setGoalPct] = useState(100);
	const [priority, setPriority] = useState("new-old");
	const [onlyMissing, setOnlyMissing] = useState(true);
	const [missingPct, setMissingPct] = useState(40);

	const [assignmentsToGetGoal, setAssignmentsToGetGoal] = useState([]);
	const [pointsForGoal, setPointsForGoal] = useState(0);
	const [maxPoints, setMaxPoints] = useState(0);
	const [earnedPoints, setEarnedPoints] = useState(0);

	const [showAssignments, setShowAssignments] = useState(false);

	const priorities = [
		"high-low",
		"low-high",
		"new-old",
		"old-new",
	]

	// TODO: weighted grading
	const calculate = async () => {
		// add up all the points from the assignments
		// could use the ones from studentvue but this makes sure everything works out
		let maxRunningTotal = 0;
		let earnedRunningTotal = 0;

		assignments.forEach(async (assignment) => {
			// scores are saved as either of the following:
			// "5.00 / 5.00" - assignment is graded
			// "5.00 Points Possible" - assignment is not graded yet
			var splitPoints = assignment.Points.split("/");

			if (splitPoints.length > 1) {
				maxRunningTotal += Number(splitPoints[1]);
				earnedRunningTotal += Number(splitPoints[0]);
			}
		})

		let currentPct = earnedRunningTotal / maxRunningTotal;

		let sortedAssignments;

		switch (priority) {
			case "new-old":
				sortedAssignments = [...assignments].sort((a, b) => {
					let dateA = new Date(a.DueDate);
					let dateB = new Date(b.DueDate);

					return dateB < dateA;
				})
				break;
			case "old-new":
				sortedAssignments = [...assignments].sort((a, b) => {
					let dateA = new Date(a.DueDate);
					let dateB = new Date(b.DueDate);

					return dateA < dateB;
				}).reverse()
				break;
			case "high-low":
				sortedAssignments = [...assignments].sort((a, b) => {
					let ptsA = a.Points.split("/")
					let ptsB = b.Points.split("/")

					if (ptsA.length <= 1) ptsA = 0;
					else ptsA = ptsA[1] - ptsA[0];

					if (ptsB.length <= 1) ptsB = 0;
					else ptsB = ptsB[1] - ptsB[0];

					return ptsB - ptsA;
				})
				break;
			case "low-high":
				sortedAssignments = [...assignments].sort((a, b) => {
					let ptsA = a.Points.split("/")
					let ptsB = b.Points.split("/")

					if (ptsA.length <= 1) ptsA = 0;
					else ptsA = ptsA[1];

					if (ptsB.length <= 1) ptsB = 0;
					else ptsB = ptsB[1];

					return ptsA - ptsB;
				})
				break;
			default:
				sortedAssignments = assignments;
				break;
		}

		let assignmentsToDo = [];
		let availablePoints = 0;
		for (let i = 0; i < sortedAssignments.length; i++) {
			if (Math.round(Number(((earnedRunningTotal + availablePoints) / maxRunningTotal).toFixed(4)) * 100) >= goalPct) {
				i = sortedAssignments.length + 10;
			} else {
				let _a = sortedAssignments[i];
				let _score = _a.Points.split("/");

				if (_score.length <= 1) {
					// Assignment is not graded	
				} else if (Number(_score[0]) < Number(_score[1]) && !onlyMissing) {
					// full points not earned
					availablePoints += Number(_score[1]) - Number(_score[0]);
					assignmentsToDo.push(_a);
				} else if (_a.Notes === "Missing  " || _score[0] / _score[1] === missingPct / 100) {
					// assignment not submitted
					availablePoints += Number(_score[1]) - Number(_score[0]);
					assignmentsToDo.push(_a);
				}
			}
		}

		setAssignmentsToGetGoal(assignmentsToDo);
		setPointsForGoal(availablePoints);
		setEarnedPoints(earnedRunningTotal);
		setMaxPoints(maxRunningTotal);
	}

	return (
		<div className="flex flex-col">
			<div className="flex flex-col lg:flex-row mt-4 gap-4 lg:mx-4">
				{ categories !== null ? (
					<div className="bg-primary rounded-lg p-4 flex flex-col self-start">
						<h2 className = "text-center font-bold text-xl mb-2">Grade Weighting</h2>
						<>
							{categories.map((category, i) => {
								return (
									<div key = {i}>
										<h3 className = "font-bold">{category.Type} [{category.Weight}]</h3>
										<progress className = "inverted" max = "100" value = {category.Weight.replace("%", "")} />
									</div>
								)
							})}	
						</>
					</div>
				) : "" }
				
				<div className="bg-primary rounded-lg p-4 flex flex-col self-start">
					<div>
						
					</div>

					<div className="flex flex-row gap-4">
						<div className="flex flex-col">
							<label htmlFor="desiredPct">Goal (%)</label>
							<input max="100" min="0" className="bg-background rounded-lg px-2 py-1 w-24" onChange={(e) => {
								setGoalPct(Number(e.target.value));
							}} type="number" id="desiredPct" value={goalPct} />
						</div>

						<div className="flex flex-col">
							<label htmlFor="prioritize">Priority</label>
							<select onChange={(e) => { setPriority(e.target.value) }} id="prioritize" className="bg-background rounded-lg px-2 py-1">
								{priorities.map(p => {
									if (p === priority) {
										return <option value={p} selected>{p.replace("-", " > ")}</option>
									} else {
										return <option value={p}>{p.replace("-", " > ")}</option>
									}
								})}
							</select>
						</div>
					</div>

					<div className="flex flex-col">
						<label htmlFor="missingPct">What % do Missing Assignments get?</label>
						<input max="100" min="0" className="bg-background rounded-lg px-2 py-1 w-full" onChange={(e) => {
							setMissingPct(Number(e.target.value));
						}} type="number" id="missingPct" value={missingPct} />
					</div>

					<div>
						<label htmlFor="onlyMissing">Only include missing?</label>
						<input className="ml-2" onChange={(e) => {
							setOnlyMissing(e.target.checked)
						}} type="checkbox" checked={onlyMissing} />
					</div>

					<div>
						<span className="button" onClick={calculate}>Calculate</span>
					</div>
				</div>

				{assignmentsToGetGoal.length > 0 && (
					<div className="bg-primary rounded-lg p-4 flex flex-col">
						<div>
							<h2>To get <span className="font-bold">{Math.round(Number(((earnedPoints + pointsForGoal) / maxPoints).toFixed(4)) * 100)}%</span> in {course.Title}</h2>
							<h3 className="text-sm">You should do the following assignments:</h3>
						</div>

						<div className="my-4">
							<table className="overflow-x-scroll">
								<thead>
									<tr className="text-left">
										<th>Due Date</th>
										<th>Name</th>
										<th>Current Score</th>
									</tr>
								</thead>

								<tbody>
									{assignmentsToGetGoal.map(a => (
										<tr key={a.GradebookID}>
											<td className="pr-2">{a.DueDate}</td>
											<td className="pr-2">{a.Measure}</td>
											<td>{a.Points}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div>
							<h2>This will earn you <span className="font-bold">{pointsForGoal.toFixed(1)}</span> points and {Math.round(Number(((earnedPoints + pointsForGoal) / maxPoints).toFixed(4)) * 100)}% in the class</h2>
							{Math.round(Number(((earnedPoints + pointsForGoal) / maxPoints).toFixed(4)) * 100) < goalPct ? (
								<h3 className="text-sm">This is less than your goal of {goalPct}% because the calculation does not include assignments that you already scored less than 100% on, if you would like to include those, uncheck the &quot;only include missing?&quot; box</h3>
							) : ""}
						</div>
					</div>
				)}
			</div>

			{ assignments.length >= 1 && (
				<div className="bg-primary p-4 rounded-lg lg:mx-4 mt-4">
					<table>
						<thead>
							<tr>
								<th></th>
								<th>Due Date</th>
								<th>Assignment Name</th>
								<th>Score</th>
							</tr>
						</thead>
	
						<tbody>
							{assignments.map(assignment => (
								<Assignment key = {assignment.Measure} assignment={assignment} flag={flag} user={user} />
							))}
						</tbody>
					</table>
				</div>
			) }
		</div>
	)
}

const Attendance = ({ attendance }) => {
	return (
		<>
			<div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
				{attendance.Absences.Absence.map(a => (
					<div key = {a.AbsenceDate} className={`p-4 bg-primary rounded-lg flex flex-col`}>
						<div className="flex flex-col gap-4">
							<span className="font-bold text-lg">{a.AbsenceDate}</span>
							<span className="text-xl">{a.Reason}</span>
						</div>
					</div>
				))}
			</div>
		</>
	)
}

const MainArea = ({ selectedTab, gradebook, schedule, calendar, studentInfo, messages, attendance, user, flag }) => {
	switch (selectedTab) {
		case "Home": return <HomeTab flag={flag} user={user} gradebook={gradebook} schedule={schedule} calendar={calendar} studentInfo={studentInfo} messages={messages} />;
		case "Gradebook": return <GradeBook flag={flag} gradebook={gradebook} user={user} />;
		case "Schedule": return <Schedule schedule={schedule} />;
		case "Attendance": return <Attendance attendance={attendance} />;
		default:
			return (
				<div>
					That page does not exist
				</div>
			)
	}
}

const HomeTab = ({ gradebook, schedule, calendar, studentInfo, messages, user, flag }) => {
	const [daysRemaining, setDaysRemaining] = useState("0");
	const [daysDone, setDaysDone] = useState("0");
	const [date, setDate] = useState("1/1/23");
	const [today, setToday] = useState("1/1/23");
	const [holidays, setHolidays] = useState([]);
	const [highlightedMessage, setHighlightedMessage] = useState(null);

	const getDaysUntilDate = (d) => {
		const now = new Date();
		var Difference_In_Time = d.getTime() - now.getTime();
		var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

		return Difference_In_Days;
	}

	useEffect(() => {
		let now = new Date();
		let toSet = String(now.getMonth() + 1).padStart(2, "0") + "/" + String(now.getDate()).padStart(2, "0") + "/" + String(now.getFullYear());
		setDate(toSet);
		setToday(toSet);

		setHolidays(calendar.EventLists.EventList.filter((item) => {
			let d = new Date(item.Date);

			return (d > new Date() && item.DayType === "Holiday")
		}))

		setDaysRemaining(getDaysUntilDate(new Date(calendar.SchoolEndDate)).toFixed(6));
		setDaysDone(Math.abs(getDaysUntilDate(new Date(calendar.SchoolBegDate))).toFixed(6));

		setInterval(() => {
			setDaysRemaining(getDaysUntilDate(new Date(calendar.SchoolEndDate)).toFixed(6));
			setDaysDone(Math.abs(getDaysUntilDate(new Date(calendar.SchoolBegDate))).toFixed(6));
		}, 1000)
	}, [calendar])

	const changeDate = (direction) => {
		let dates = calendar.EventLists.EventList.map(item => {
			return item.Date
		})

		dates = dates.filter((c, index) => {
			return dates.indexOf(c) === index;
		});

		let currentDate = dates.indexOf(date);

		if (currentDate === -1) return;

		switch (direction) {
			case "future":
				if (currentDate === dates.length - 1) currentDate = -1;
				setDate(dates[currentDate + 1]);
				break;
			case "past":
				if (currentDate === 0) currentDate = dates.length;
				setDate(dates[currentDate - 1]);
				break;
			default:
				setDate(today);
				break;
		}
	}

	return (
		<>
			<div onClick={() => { setHighlightedMessage(null) }} className={`cursor-pointer fixed z-40 top-0 transition duration-200 left-0 w-screen h-screen bg-black ${highlightedMessage !== null ? "opacity-80 pointer-events-auto" : "opacity-0 pointer-events-none"}`}></div>

			{highlightedMessage !== null && (
				<div className="z-50 top-0 left-0 fixed w-screen h-screen grid place-items-center pointer-events-none">
					<div className="bg-primary overflow-y-scroll max-h-screen max-w-screen rounded-lg p-4 mx-4 lg:mx-12 pointer-events-auto">
						<div className="w-full flex flex-row justify-end">
							<span><AiOutlineClose className="text-xl cursor-pointer stroke-1" onClick={() => { setHighlightedMessage(null) }} /></span>
						</div>
						<h1 className="font-bold text-2xl">{highlightedMessage.SubjectNoHTML}</h1>
						<h2 className="opacity-80 text-lg italic">From: {highlightedMessage.From}</h2>
						<h3 className="opacity-80 text-lg italic mb-6">{highlightedMessage.BeginDate}</h3>

						<div className="pl-4 text-white max-w-screen"
							dangerouslySetInnerHTML={{ __html: highlightedMessage.Content }}
						/>
					</div>
				</div>
			)}

			<div className={`flex flex-col mt-2`}>
				<div>
					<h1 className="w-full text-center font-bold text-xl block">School Completion ({((Number(daysDone) / (Number(daysRemaining) + Number(daysDone))) * 100).toFixed(2)}%)</h1>
					<progress max={Number(daysDone) + Number(daysRemaining)} value={Number(daysDone)} />
				</div>

				<div className="flex flex-col lg:flex-row mt-4 gap-4">
					<div className="flex flex-col w-full lg:w-1/3 gap-4">
						<div className="p-4 bg-primary rounded-lg self-start w-full">
							<h1 className="font-bold text-xl">{studentInfo.FormattedName}</h1>
							<h2 className="ml-2 opacity-80">Grade {studentInfo.Grade}, {studentInfo.CurrentSchool}</h2>
							<br />

							{holidays.length >= 1 && (
								<span>Next no school day in <span className="font-bold">{Math.round(getDaysUntilDate(new Date(holidays[0].Date)))} days</span></span>
							)}

							<br />
							<span className="font-bold">{daysDone}</span> days of school completed <br />
							<span className="font-bold">{daysRemaining}</span> days of school remaining
						</div>

						<div className="p-4 bg-primary rounded-lg w-full">
							<h1 className="font-bold text-xl text-center">Recent Messages</h1>

							<div className="flex flex-col">
								{messages.MessageListings.MessageListing.map(message => (
									<div key={message.SubjectNoHTML} onClick={() => { setHighlightedMessage(message) }} className="transition duration-200 hover:bg-background p-2 cursor-pointer rounded-lg">
										<h3 className="font-bold">{message.SubjectNoHTML}</h3>
										<h4 className="opacity-80 text-sm">From: {message.From}</h4>
										<h4 className="opacity-80 text-sm">{message.BeginDate}</h4>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="flex flex-col w-full lg:w-2/3 gap-4">
						<div className="p-4 bg-primary rounded-lg self-start w-full">
							<div className="flex flex-row justify-center gap-4">
								<BsChevronLeft className="cursor-pointer font-bold text-xl stroke-1" onClick={() => { changeDate("past") }} />
								<h2 className="font-bold text-xl text-center select-none">{date}</h2>
								<MdToday className="cursor-pointer font-bold text-xl" onClick={changeDate} />
								<BsChevronRight className="cursor-pointer font-bold text-xl stroke-1" onClick={() => { changeDate("future") }} />
							</div>
							{calendar.EventLists.EventList.filter((item) => {
								// if (item.DayType !== "Assignment") return false;

								let itemDate = new Date(item.Date);
								let now = new Date(date);

								return (itemDate.getMonth() === now.getMonth() && itemDate.getDate() === now.getDate());
							}).map(item => {
								let itemSplit = item.Title.split(":");

								return (
									<div key={item.Title} className="lg:mt-1 mt-3 ml-4 select-none">
										<h3><span className="font-bold">{itemSplit[0]}</span> {itemSplit.length > 1 ? ": " + itemSplit[1] : ""} {itemSplit.length > 2 ? ": " + itemSplit[2] : ""}</h3>
									</div>
								)
							})}
						</div>

						<div className="p-4 bg-primary rounded-lg self-start w-full">
							<div className="flex flex-row justify-center gap-4">
								<h2 className="font-bold text-xl text-center select-none">Tracked Assignments</h2>
							</div>

							<div>
								<table>
									<thead>
										<tr>
											<th></th>
											<th>Due Date</th>
											<th>Assignment Name</th>
											<th>Score</th>
										</tr>
									</thead>

									<tbody>
										{user.trackedAssignments.map((track, i) => {
											let _a;
											gradebook.Courses.Course.forEach(course => {
												var temp = course.Marks.Mark.Assignments.Assignment;
												if (temp === undefined) {
													temp = [];
												} else if (!temp.length) {
													temp = [course.Marks.Mark.Assignments.Assignment]
												}

												let filteredAssignments = temp.filter(assignment => {
													return assignment.GradebookID === track;
												})

												if (filteredAssignments.length) {
													_a = filteredAssignments[0];
												}
											});

											return (
												<Assignment key = {i} assignment={_a} flag={flag} user={user} />
											)
										})}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

const Assignment = ({ assignment, flag, user }) => {
	console.log(assignment)
	if (assignment) {
		return (
			<tr key={assignment.GradebookID} onClick={() => { flag(assignment.GradebookID) }} className={`cursor-pointer ${assignment.Notes === "Missing  " ? "text-red-500" : "text-white"}`}>
				<td>{user.trackedAssignments.includes(assignment.GradebookID) ? <AiFillFlag /> : ""}</td>
				<td className="pr-4">{assignment.DueDate}</td>
				<td className="pr-4">{assignment.Measure}</td>
				<td>{assignment.Points}</td>
			</tr>
		)
	} else return <></>;
}

export default Home