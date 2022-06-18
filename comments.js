const express = require('express')
const cors = require('cors')
const app = express()

const connect = require('./models/db')

const Comment = require('./models/Comment')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.get('/api/comment/:postId', async (req, res) => {
	const comments = await Comment.find({post_id: req.params.postId})
	res.json(comments)
})


app.get('/api/comment/delete/:commentId' , async (req, res) => {
	const comment = await Comment.findByIdAndDelete(req.params.commentId)
	res.json({ status: true })
})

app.post('/api/comment/create', async (req, res) => {
	const { post_id, user_id, content } = req.body

	/* ---------------------------- validate request ---------------------------- */
	if (!post_id || !user_id || !content) {
		res.status(400).json({ error: 'post_id, user_id and content are required' })
		return
	}
	/* -------------------- moderate comment for banned words ------------------- */

	let status = 'pending'

	try {
		// send a POST request with data using fetch to the moderation service
		const response = await fetch('http://localhost:3004/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ content })
		})

		// get the response from the moderation service
		const res = await response.json()

		status = res.status
		console.log(status);
	} catch (error) {
		console.log(error)
	}

	try {
		const comment = await Comment.create({
			post_id,
			user_id,
			content,
			status
		})

		res.json(comment)
	} catch (error) {
		console.log(error)
		res.status(400).json({ error: 'Validation Error', errors: error })
	}
})

/* ---------------- variables for port and connection string ---------------- */
const port = 3003
const connection_url = 'mongodb://127.0.0.1:27017/Comments'

/* ---------------- mongoose connection ---------------- */
connect(connection_url)

/* ------------------------------ server setup ------------------------------ */
app.listen(port, () => {
	console.log(`Comments service running on port ${port}`)
})
