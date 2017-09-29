Jonah Feldman
9-28-17
Sample Code for application to Harvard Technology Instructor internship

The Program meets all the requirements listed in the specification, and
for the "go the extra mile" the admin page is password protected


Purpose: The Purpose of this program is to create a website where students
		  can ask questions about their schoolwork, and Teaching Fellows
		  can look at those questions and take students names off the list
		  after they have completed a question

Key Files:
		  home.html: the root page you receive after you access [url]. This file
		  			displays a list of the waiting students and the questions they asked.
		  			It also has a name and question box so students can ask their question
		  			and be put at the end of the queue.

		  admin.html:  This is the page you receive after successfully typing the password in password.html.
		  			This page is for the Teaching Fellows, and also displays the 
		  			list of students like the home.html. But unlike home, it 
		  			contains a remove button for each student so the TFs can 
		  			remove them from the queue. 

		  index.js: this page sets up and runs the server for this program, and
		  			handles the POST/GET requests from the above html files. 
		  			The Server is responsible for storing the queue of students/questions,
		  			and does so in a MongoDB database. In that database, it records the student,
		  			their question, and the time their question was submitted.
		  			The Server also uses socket.io to tell the clients when
		  			the queue is changed, and the pages will reload their queues
		  			accordingly.

		  password.html:This is the page you receive after accessing [url]/admin.
		  				Entering the correct password (Ex0dia) will grant you access to the admin page



